package com.example.WebNovelReviewSite.domain.novel.service;

import com.example.WebNovelReviewSite.domain.badge.event.CollectionCreatedEvent;
import com.example.WebNovelReviewSite.domain.novel.dto.CollectionRequestDTO;
import com.example.WebNovelReviewSite.domain.novel.dto.CollectionResponseDTO;
import com.example.WebNovelReviewSite.domain.novel.entity.Collection;
import com.example.WebNovelReviewSite.domain.novel.entity.CollectedNovel;
import com.example.WebNovelReviewSite.domain.novel.entity.CollectedNovelId;
import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.entity.SavedCollection;
import com.example.WebNovelReviewSite.domain.novel.entity.SavedCollectionId;
import com.example.WebNovelReviewSite.domain.novel.repository.CollectedNovelRepository;
import com.example.WebNovelReviewSite.domain.novel.repository.CollectionRepository;
import com.example.WebNovelReviewSite.domain.novel.repository.NovelRepository;
import com.example.WebNovelReviewSite.domain.novel.repository.SavedCollectionRepository;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;
    private final NovelRepository novelRepository;
    private final CollectedNovelRepository collectedNovelRepository;
    private final SavedCollectionRepository savedCollectionRepository;

    @Transactional
    public Long createCollection(CollectionRequestDTO.CollectionCreateDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        Collection collection = Collection.builder()
                .user(user)
                .collectionName(request.getCollectionName())
                .content(request.getContent())
                .collectedNovels(new ArrayList<>())
                .build();

        Collection saved = collectionRepository.save(collection);
        return saved.getCollectionId();
    }

    @Transactional
    public void updateCollection(Long collectionId, CollectionRequestDTO.CollectionUpdateDto request) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));

        if (request.getCollectionName() != null)
            collection.setCollectionName(request.getCollectionName());
        if (request.getContent() != null)
            collection.setContent(request.getContent());
    }

    @Transactional
    public void deleteCollection(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));
        collectionRepository.delete(collection);
    }

    @Transactional
    public void addNovelToCollection(Long collectionId, Long novelId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));

        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작품입니다."));

        CollectedNovelId id = new CollectedNovelId(collectionId, novelId);
        CollectedNovel collectedNovel = new CollectedNovel(id, collection, novel);
        collectedNovelRepository.save(collectedNovel);
    }

    @Transactional
    public void removeNovelFromCollection(Long collectionId, Long novelId) {
        CollectedNovelId id = new CollectedNovelId(collectionId, novelId);
        collectedNovelRepository.deleteById(id);
    }

    public List<CollectionResponseDTO.CollectionDetailDto> getCollectionsByUser(Long userId) {
        return collectionRepository.findByUser_UserId(userId).stream()
                .map(collection -> {
                    Long saveCount = savedCollectionRepository.countByCollectionId(collection.getCollectionId());
                    return CollectionResponseDTO.CollectionDetailDto.builder()
                            .collectionId(collection.getCollectionId())
                            .userId(collection.getUser().getUserId())
                            .userName(collection.getUser().getName())
                            .collectionName(collection.getCollectionName())
                            .content(collection.getContent())
                            .novelCount(collection.getCollectedNovels().size())
                            .saveCount(saveCount)
                            .createdAt(collection.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public CollectionResponseDTO.CollectionDetailDto getCollection(Long collectionId) {
        return getCollection(collectionId, null);
    }
    
    public CollectionResponseDTO.CollectionDetailDto getCollection(Long collectionId, Long currentUserId) {
        Collection collection = collectionRepository.findByIdWithNovels(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));

        // 소설 목록 변환
        List<CollectionResponseDTO.NovelSimpleDto> novels = collection.getCollectedNovels().stream()
                .map(cn -> CollectionResponseDTO.NovelSimpleDto.builder()
                        .novelId(cn.getNovel().getNovelId())
                        .novelName(cn.getNovel().getNovelName())
                        .novelAuthor(cn.getNovel().getNovelAuthor())
                        .genre(cn.getNovel().getGenre() != null ? cn.getNovel().getGenre().name() : null)
                        .novelStatus(cn.getNovel().getNovelStatus() != null ? cn.getNovel().getNovelStatus().name() : null)
                        .build())
                .collect(Collectors.toList());

        Long saveCount = savedCollectionRepository.countByCollectionId(collectionId);
        Boolean isSaved = false;
        if (currentUserId != null) {
            SavedCollectionId savedId = new SavedCollectionId(currentUserId, collectionId);
            isSaved = savedCollectionRepository.existsById(savedId);
        }

        return CollectionResponseDTO.CollectionDetailDto.builder()
                .collectionId(collection.getCollectionId())
                .userId(collection.getUser().getUserId())
                .userName(collection.getUser().getName())
                .collectionName(collection.getCollectionName())
                .content(collection.getContent())
                .novelCount(collection.getCollectedNovels().size())
                .saveCount(saveCount)
                .isSaved(isSaved)
                .createdAt(collection.getCreatedAt())
                .novels(novels)
                .build();
    }
    
    public List<CollectionResponseDTO.CollectionDetailDto> getAllCollections() {
        return getAllCollections(null);
    }
    
    public List<CollectionResponseDTO.CollectionDetailDto> getAllCollections(Long currentUserId) {
        return collectionRepository.findAllWithNovels().stream()
                .map(collection -> {
                    Long saveCount = savedCollectionRepository.countByCollectionId(collection.getCollectionId());
                    Boolean isSaved = false;
                    if (currentUserId != null) {
                        SavedCollectionId savedId = new SavedCollectionId(currentUserId, collection.getCollectionId());
                        isSaved = savedCollectionRepository.existsById(savedId);
                    }
                    return CollectionResponseDTO.CollectionDetailDto.builder()
                            .collectionId(collection.getCollectionId())
                            .userId(collection.getUser().getUserId())
                            .userName(collection.getUser().getName())
                            .collectionName(collection.getCollectionName())
                            .content(collection.getContent())
                            .novelCount(collection.getCollectedNovels().size())
                            .saveCount(saveCount)
                            .isSaved(isSaved)
                            .createdAt(collection.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    // 컬렉션 저장 (북마크)
    @Transactional
    public void saveCollection(Long userId, Long collectionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 컬렉션입니다."));
        
        SavedCollectionId id = new SavedCollectionId(userId, collectionId);
        if (savedCollectionRepository.existsById(id)) {
            throw new IllegalArgumentException("이미 저장한 컬렉션입니다.");
        }
        
        SavedCollection savedCollection = SavedCollection.builder()
                .id(id)
                .user(user)
                .collection(collection)
                .build();
        savedCollectionRepository.save(savedCollection);
    }
    
    // 컬렉션 저장 취소
    @Transactional
    public void unsaveCollection(Long userId, Long collectionId) {
        SavedCollectionId id = new SavedCollectionId(userId, collectionId);
        if (!savedCollectionRepository.existsById(id)) {
            throw new IllegalArgumentException("저장하지 않은 컬렉션입니다.");
        }
        savedCollectionRepository.deleteById(id);
    }
    
    // 유저가 저장한 컬렉션 목록
    public List<CollectionResponseDTO.CollectionDetailDto> getSavedCollections(Long userId) {
        return savedCollectionRepository.findByUser_UserId(userId).stream()
                .map(sc -> {
                    Collection collection = sc.getCollection();
                    Long saveCount = savedCollectionRepository.countByCollectionId(collection.getCollectionId());
                    return CollectionResponseDTO.CollectionDetailDto.builder()
                            .collectionId(collection.getCollectionId())
                            .userId(collection.getUser().getUserId())
                            .userName(collection.getUser().getName())
                            .collectionName(collection.getCollectionName())
                            .content(collection.getContent())
                            .novelCount(collection.getCollectedNovels() != null ? collection.getCollectedNovels().size() : 0)
                            .saveCount(saveCount)
                            .isSaved(true)
                            .createdAt(collection.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
