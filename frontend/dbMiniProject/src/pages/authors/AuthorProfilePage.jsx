import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './AuthorProfilePage.module.scss'
import { Header } from '../../components/Header'
import { Novel1, Novel2, Novel3, Novel4, Novel5, Novel6, Novel7, Novel8, Novel9, Novel10, Novel11, Novel12, Novel13, Novel14, Novel15, Novel16, Novel17, Novel18, Novel19, Novel20, Empty } from '../../assets'

// 소설 ID에 맞는 이미지 가져오기
const getNovelImage = (novelId) => {
  const novelImages = {
    1: Novel1, 2: Novel2, 3: Novel3, 4: Novel4, 5: Novel5,
    6: Novel6, 7: Novel7, 8: Novel8, 9: Novel9, 10: Novel10,
    11: Novel11, 12: Novel12, 13: Novel13, 14: Novel14, 15: Novel15,
    16: Novel16, 17: Novel17, 18: Novel18, 19: Novel19, 20: Novel20,
  };
  return novelImages[novelId] || Empty;
};
import { readAuthorApi } from '../../apis/authors/authors'
import { readUserReviewsApi } from '../../apis/reviews/reviews'
import { readUserCollectionApi, readCollectionDetailApi } from '../../apis/collections/collections'
import { readNovelApi } from '../../apis/novels/novel'
import { addFollowApi, deleteFollowApi, readFollowingApi } from '../../apis/follow/follow'

export const AuthorProfilePage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [author, setAuthor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [collections, setCollections] = useState([])
  const [novels, setNovels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  const tabs = ['작품', '리뷰', '컬렉션']

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true)
      
      const currentUserId = localStorage.getItem('userId')
      setIsOwnProfile(currentUserId === userId)

      // 작가 프로필 조회
      const authorResult = await readAuthorApi(userId)
      if (authorResult.ok && authorResult.data) {
        setAuthor(authorResult.data)
        
        // 작가의 작품 조회 (작가 이름으로 필터링)
        const novelsResult = await readNovelApi()
        if (novelsResult.ok && novelsResult.data) {
          const authorNovels = novelsResult.data.filter(
            novel => novel.novelAuthor === authorResult.data.penName
          )
          setNovels(authorNovels)
        }
      } else {
        // 임시 데이터
        setAuthor({
          userId: userId,
          penName: '이영도',
          nationality: '대한민국',
          debutYear: '1998',
          brief: '판타지 소설의 거장. 눈물을 마시는 새, 피를 마시는 새 등의 작품으로 유명합니다.',
          profileImage: null,
          isConfirmed: true
        })
      }

      // 작가의 리뷰 조회
      const reviewsResult = await readUserReviewsApi(userId)
      if (reviewsResult.ok && reviewsResult.data) {
        setReviews(reviewsResult.data)
      }

      // 작가의 컬렉션 조회
      const collectionsResult = await readUserCollectionApi(userId)
      if (collectionsResult.ok && collectionsResult.data) {
        // 각 컬렉션의 커버 이미지 설정
        const collectionsWithImages = await Promise.all(
          collectionsResult.data.map(async (collection) => {
            let coverImage = Empty
            if (collection.novelCount > 0) {
              const detailResult = await readCollectionDetailApi(collection.collectionId, userId)
              if (detailResult.ok && detailResult.data && detailResult.data.novels && detailResult.data.novels.length > 0) {
                coverImage = getNovelImage(detailResult.data.novels[0].novelId)
              }
            }
            return { ...collection, coverImage }
          })
        )
        setCollections(collectionsWithImages)
      }

      // 현재 로그인한 유저가 이 작가를 팔로우하고 있는지 확인
      if (currentUserId && currentUserId !== userId) {
        const myFollowingResult = await readFollowingApi(currentUserId)
        if (myFollowingResult.ok && myFollowingResult.data) {
          const isFollowingUser = myFollowingResult.data.some(
            f => f.userId === parseInt(userId)
          )
          setIsFollowing(isFollowingUser)
        }
      }

      setLoading(false)
    }

    fetchAuthorData()
  }, [userId])

  const handleNovelClick = (novelId) => {
    navigate(`/detail/${novelId}`)
  }

  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`)
  }

  const handleFollow = async () => {
    const currentUserId = localStorage.getItem('userId')
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    if (isFollowing) {
      // 언팔로우
      const result = await deleteFollowApi(currentUserId, userId)
      if (result.ok) {
        setIsFollowing(false)
      }
    } else {
      // 팔로우
      const result = await addFollowApi(currentUserId, userId)
      if (result.ok) {
        setIsFollowing(true)
      }
    }
  }

  if (loading || !author) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        {/* 작가 프로필 헤더 */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {author.profileImage && !author.profileImage.includes('example.com') ? (
              <img 
                src={author.profileImage} 
                alt={author.penName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span style={{ display: author.profileImage && !author.profileImage.includes('example.com') ? 'none' : 'flex' }}>
              {author.penName?.charAt(0) || '?'}
            </span>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.authorBadge}>✍️ 작가</div>
            <h1 className={styles.penName}>{author.penName}</h1>
            <p className={styles.nationality}>{author.nationality}</p>
            <p className={styles.debutYear}>데뷔: {author.debutYear}년</p>
            <p className={styles.brief}>{author.brief}</p>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{novels.length}</span>
              <span className={styles.statLabel}>작품</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{reviews.length}</span>
              <span className={styles.statLabel}>리뷰</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{collections.length}</span>
              <span className={styles.statLabel}>컬렉션</span>
            </div>
          </div>
          {!isOwnProfile && (
            <button 
              className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? '팔로잉 ✓' : '팔로우'}
            </button>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <nav className={styles.tabNav}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`${styles.tabButton} ${selectedTab === index ? styles.active : ''}`}
              onClick={() => setSelectedTab(index)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* 컨텐츠 영역 */}
        <div className={styles.contentSection}>
          {/* 작품 탭 */}
          {selectedTab === 0 && (
            <div className={styles.novelGrid}>
              {novels.length === 0 ? (
                <div className={styles.emptyMessage}>등록된 작품이 없습니다.</div>
              ) : (
                novels.map((novel) => (
                  <div 
                    key={novel.novelId} 
                    className={styles.novelCard}
                    onClick={() => handleNovelClick(novel.novelId)}
                  >
                    <img src={getNovelImage(novel.novelId)} alt={novel.novelName} className={styles.novelCover} />
                    <div className={styles.novelInfo}>
                      <h3 className={styles.novelTitle}>{novel.novelName}</h3>
                      <span className={styles.novelGenre}>{novel.genre}</span>
                      <span className={styles.novelStatus}>
                        {novel.novelStatus === 'COMPLETED' ? '완결' : '연재중'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 리뷰 탭 */}
          {selectedTab === 1 && (
            <div className={styles.reviewList}>
              {reviews.length === 0 ? (
                <div className={styles.emptyMessage}>작성한 리뷰가 없습니다.</div>
              ) : (
                reviews.map((review) => (
                  <div 
                    key={review.reviewId} 
                    className={styles.reviewCard}
                    onClick={() => handleNovelClick(review.novelId)}
                  >
                    <div className={styles.reviewNovelImage}>
                      <img src={getNovelImage(review.novelId)} alt={review.novelName} />
                    </div>
                    <div className={styles.reviewDetails}>
                      <div className={styles.reviewHeader}>
                        <h4 className={styles.novelName}>{review.novelName}</h4>
                        <span className={styles.reviewRating}>⭐ {review.star}</span>
                      </div>
                      <p className={styles.reviewContent}>{review.content}</p>
                      <div className={styles.reviewFooter}>
                        <span className={styles.likeCount}>👍 {review.likeCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 컬렉션 탭 */}
          {selectedTab === 2 && (
            <div className={styles.collectionGrid}>
              {collections.length === 0 ? (
                <div className={styles.emptyMessage}>생성한 컬렉션이 없습니다.</div>
              ) : (
                collections.map((collection) => (
                  <div 
                    key={collection.collectionId} 
                    className={styles.collectionCard}
                    onClick={() => handleCollectionClick(collection.collectionId)}
                  >
                    <div className={styles.collectionCover}>
                      <img src={collection.coverImage || Empty} alt={collection.collectionName} />
                    </div>
                    <div className={styles.collectionInfo}>
                      <h3 className={styles.collectionName}>{collection.collectionName}</h3>
                      <span className={styles.novelCount}>{collection.novelCount || 0}권</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
