import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CollectionListPage.module.scss'
import { Header } from '../../components/Header'
import { Novel1, Novel2, Novel3, Novel4, Novel5, Novel6, Novel7, Novel8, Novel9, Novel10, Novel11, Novel12, Novel13, Novel14, Novel15, Novel16, Novel17, Novel18, Novel19, Novel20, Empty } from '../../assets'
import { readAllCollectionsApi, readCollectionDetailApi, saveCollectionApi, unsaveCollectionApi } from '../../apis/collections/collections'

export const CollectionListPage = () => {
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const [sortedCollections, setSortedCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all') // all, popular, recent
  
  const currentUserId = localStorage.getItem('userId')
  
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
  
  const fetchCollections = async () => {
    setLoading(true)
    const result = await readAllCollectionsApi(currentUserId)
    if (result.ok && result.data) {
      // 각 컬렉션의 상세 정보를 가져와서 소설 이미지 설정
      const transformedPromises = result.data.map(async (c) => {
        let coverImages = [Empty] // 기본값: 빈 이미지
        
        // 소설이 있는 경우 상세 정보 조회
        if (c.novelCount > 0) {
          const detailResult = await readCollectionDetailApi(c.collectionId, currentUserId)
          if (detailResult.ok && detailResult.data && detailResult.data.novels) {
            const novels = detailResult.data.novels
            const novelIds = novels.map(n => n.novelId)
            
            if (novelIds.length >= 4) {
              // 4권 이상: 처음 4개 이미지 표시
              coverImages = novelIds.slice(0, 4).map(id => getNovelImage(id))
            } else if (novelIds.length > 0) {
              // 3권 이하: 첫 번째 이미지만 표시
              coverImages = [getNovelImage(novelIds[0])]
            }
          }
        }
        
        return {
          id: c.collectionId,
          name: c.collectionName,
          description: c.content || '',
          owner: c.userName,
          userId: c.userId,
          novelCount: c.novelCount || 0,
          saveCount: c.saveCount || 0,
          isSaved: c.isSaved || false,
          coverImages: coverImages,
          createdAt: c.createdAt || new Date().toISOString()
        }
      })
      
      const transformed = await Promise.all(transformedPromises)
      setCollections(transformed)
      setSortedCollections(transformed)
    } else {
      setCollections([])
      setSortedCollections([])
    }
    setLoading(false)
  }
  
  useEffect(() => {
    fetchCollections()
  }, [])
  
  // 정렬 변경 시 컬렉션 정렬
  useEffect(() => {
    if (collections.length === 0) return
    
    let sorted = [...collections]
    switch (selectedCategory) {
      case 'all':
        // 사전순 (이름 기준)
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
        break
      case 'popular':
        // 인기순 (저장 수 기준)
        sorted.sort((a, b) => b.saveCount - a.saveCount)
        break
      case 'recent':
        // 최신순 (생성일 기준)
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }
    setSortedCollections(sorted)
  }, [selectedCategory, collections])
  
  // 컬렉션 저장/저장취소 핸들러
  const handleSaveToggle = async (e, collection) => {
    e.stopPropagation()
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      return
    }
    
    // 본인 컬렉션은 저장 불가
    if (String(collection.userId) === currentUserId) {
      alert('본인의 컬렉션은 저장할 수 없습니다.')
      return
    }
    
    if (collection.isSaved) {
      const result = await unsaveCollectionApi(collection.id, currentUserId)
      if (result.ok) {
        fetchCollections()
      } else {
        alert('저장 취소에 실패했습니다.')
      }
    } else {
      const result = await saveCollectionApi(collection.id, currentUserId)
      if (result.ok) {
        fetchCollections()
      } else {
        alert('저장에 실패했습니다.')
      }
    }
  }
  
  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`)
  }
  
  const categories = [
    { id: 'all', label: '전체' },
    { id: 'popular', label: '인기' },
    { id: 'recent', label: '최신' }
  ]
  
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>컬렉션</h1>
          <p className={styles.pageSubtitle}>
            다른 독자들이 만든 컬렉션을 둘러보세요! 📚
          </p>
        </div>
        
        {/* 카테고리 필터 */}
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* 컬렉션 그리드 */}
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          <div className={styles.collectionsGrid}>
            {sortedCollections.length === 0 ? (
              <div className={styles.emptyMessage}>
                아직 공개된 컬렉션이 없습니다.
              </div>
            ) : (
              sortedCollections.map((collection) => (
                <div 
                  key={collection.id} 
                  className={styles.collectionCard}
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <div className={styles.collectionCovers}>
                    {collection.coverImages.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={img} alt={`cover ${idx}`} className={styles.coverImage} />
                    ))}
                  </div>
                  <div className={styles.collectionInfo}>
                    <h3 className={styles.collectionName}>{collection.name}</h3>
                    <p className={styles.collectionDescription}>{collection.description}</p>
                    <div className={styles.collectionMeta}>
                      <span 
                        className={styles.owner}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/user/${collection.userId}`)
                        }}
                      >
                        by {collection.owner}
                      </span>
                      <div className={styles.stats}>
                        <span className={styles.novelCount}>📖 {collection.novelCount}권</span>
                        <span className={styles.saveCount}>💾 {collection.saveCount}</span>
                      </div>
                    </div>
                    {currentUserId && String(collection.userId) !== currentUserId && (
                      <button 
                        className={`${styles.saveButton} ${collection.isSaved ? styles.saved : ''}`}
                        onClick={(e) => handleSaveToggle(e, collection)}
                      >
                        {collection.isSaved ? '✓ 저장됨' : '+ 저장'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

