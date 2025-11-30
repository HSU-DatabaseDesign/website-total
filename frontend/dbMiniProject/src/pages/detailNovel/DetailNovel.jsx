import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './DetailNovel.module.scss'
import { Header } from '../../components/Header'
import { Bird, Novel1, Novel2, Novel3, Novel4, Novel5, Novel6, Novel7, Novel8, Novel9, Novel10, Novel11, Novel12, Novel13, Novel14, Novel15, Novel16, Novel17, Novel18, Novel19, Novel20 } from '../../assets'
import { readDetailNovelApi } from '../../apis/novels/novel'
import { readNovelReveiwApi, createReviewApi, updateReviewApi, deleteReviewApi, addLikeApi, deleteLikeApi } from '../../apis/reviews/reviews'
import { addNovelCollectionApi, readUserCollectionApi, createCollectionApi } from '../../apis/collections/collections'

export const DetailNovel = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const [novelData, setNovelData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' })
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [userCollections, setUserCollections] = useState([])
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  
  // 현재 로그인한 유저 정보
  const currentUserId = localStorage.getItem('userId')
  const userRole = localStorage.getItem('userRole') // ADMIN, USER, AUTHOR
  const isAdmin = userRole === 'ADMIN'
  
  // 리뷰 수정/삭제 권한 확인
  const canManageReview = (reviewUserId) => {
    if (!currentUserId) return false
    return isAdmin || currentUserId === String(reviewUserId)
  }
  
  // 임시 데이터 (API 실패 시 사용)
  const defaultNovelData = {
    id: 1,
    img: Bird,
    genre: "판타지",
    title: "눈물을 마시는 새",
    author: "이영도",
    avgStars: 4.62,
    totalReviews: 1369,
    status: "완결작",
  }
  
  // 리뷰 데이터에서 별점 분포 계산
  const calculateStarDistribution = (reviewList) => {
    const distribution = [
      { star: 5, count: 0 },
      { star: 4, count: 0 },
      { star: 3, count: 0 },
      { star: 2, count: 0 },
      { star: 1, count: 0 },
    ]
    
    reviewList.forEach(review => {
      const starIndex = distribution.findIndex(d => d.star === Math.floor(review.rating))
      if (starIndex !== -1) {
        distribution[starIndex].count++
      }
    })
    
    return distribution
  }
  
  const starDistribution = calculateStarDistribution(reviews)
  
  const tabs = ["리뷰", "평점", "공감순", "높은평점순", "최신순"]
  
  // 플랫폼 한글 변환
  const getPlatformName = (platform) => {
    const platformNames = {
      'NAVER_SERIES': '네이버 시리즈',
      'KAKAO_PAGE': '카카오페이지',
      'RIDI_BOOKS': '리디북스',
      'MUNPIA': '문피아',
      'JOARA': '조아라',
      'OTHER': '기타'
    }
    return platformNames[platform] || platform || '미정'
  }
  
  // 소설 ID에 맞는 이미지 가져오기
  const getNovelImage = (novelId) => {
    const novelImages = {
      1: Novel1, 2: Novel2, 3: Novel3, 4: Novel4, 5: Novel5,
      6: Novel6, 7: Novel7, 8: Novel8, 9: Novel9, 10: Novel10,
      11: Novel11, 12: Novel12, 13: Novel13, 14: Novel14, 15: Novel15,
      16: Novel16, 17: Novel17, 18: Novel18, 19: Novel19, 20: Novel20,
    };
    return novelImages[novelId] || Bird;
  };
  
  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformNovelData = (novel) => {
    return {
      id: novel.novelId,
      img: getNovelImage(novel.novelId),
      genre: novel.genre,
      title: novel.novelName,
      author: novel.novelAuthor,
      avgStars: novel.averageRating || 0,
      totalReviews: novel.reviewCount || 0,
      status: novel.novelStatus === 'COMPLETED' ? '완결작' : '연재중',
      platform: getPlatformName(novel.platform),
    };
  };
  
  const transformReviewData = (reviews) => {
    return reviews.map(review => ({
      id: review.reviewId,
      userId: review.userId,
      user: review.userName || '익명',
      level: 1, // TODO: 백엔드에서 레벨 정보 추가 필요
      rating: review.star || 0,
      content: review.content,
      date: review.createdAt || '날짜 없음',
      likes: review.likeCount || 0,
    }));
  };
  
  // 유저 프로필 페이지로 이동
  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  };
  
  // API 호출: 웹소설 상세 정보 및 리뷰 조회
  useEffect(() => {
    const fetchNovelDetails = async () => {
      setLoading(true)
      
      // 웹소설 상세 정보 조회
      const novelResult = await readDetailNovelApi(id)
      if (novelResult.ok && novelResult.data) {
        const transformedNovel = transformNovelData(novelResult.data);
        setNovelData(transformedNovel);
      } else {
        setNovelData(defaultNovelData)
      }
      
      // 웹소설 리뷰 목록 조회
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      } else {
        setReviews([]);
      }
      
      setLoading(false)
    }
    
    fetchNovelDetails()
  }, [id])
  
  // 리뷰 작성 핸들러
  const handleCreateReview = async (e) => {
    e.preventDefault()
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    
    const reviewData = {
      userId: parseInt(userId),
      novelId: parseInt(id),
      content: reviewForm.content,
      star: reviewForm.rating,
      hashtags: [] // TODO: 해시태그 기능 추가 시 사용
    }
    
    const result = await createReviewApi(reviewData)
    if (result.ok) {
      alert('리뷰가 작성되었습니다!')
      setShowReviewForm(false)
      setReviewForm({ rating: 5, content: '' })
      // 리뷰 목록 새로고침
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      }
    } else {
      alert('리뷰 작성에 실패했습니다. 이미 작성한 리뷰가 있을 수 있습니다.')
    }
  }
  
  // 리뷰 수정 핸들러
  const handleUpdateReview = async (reviewId) => {
    const updateData = {
      content: reviewForm.content,
      star: reviewForm.rating,
      hashtags: []
    };
    
    const result = await updateReviewApi(reviewId, updateData)
    if (result.ok) {
      alert('리뷰가 수정되었습니다!')
      setEditingReviewId(null)
      setShowReviewForm(false)
      setReviewForm({ rating: 5, content: '' })
      // 리뷰 목록 새로고침
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      }
    } else {
      alert('리뷰 수정에 실패했습니다.')
    }
  }
  
  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    
    const result = await deleteReviewApi(reviewId)
    if (result.ok) {
      alert('리뷰가 삭제되었습니다!')
      // 리뷰 목록 새로고침
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      }
    } else {
      alert('리뷰 삭제에 실패했습니다.')
    }
  }
  
  // 좋아요 추가 핸들러
  const handleAddLike = async (reviewId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    
    const result = await addLikeApi(reviewId, userId)
    if (result.ok) {
      // 리뷰 목록 새로고침
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      }
    } else {
      alert('좋아요 처리에 실패했습니다.')
    }
  }
  
  // 좋아요 삭제 핸들러 (토글용)
  const handleDeleteLike = async (reviewId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    
    const result = await deleteLikeApi(reviewId, userId)
    if (result.ok) {
      // 리뷰 목록 새로고침
      const reviewResult = await readNovelReveiwApi(id)
      if (reviewResult.ok && reviewResult.data) {
        const transformedReviews = transformReviewData(reviewResult.data);
        setReviews(transformedReviews);
      }
    }
  }
  
  // 컬렉션 모달 열기
  const handleOpenCollectionModal = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    
    // 사용자의 컬렉션 목록 조회
    const result = await readUserCollectionApi(userId)
    if (result.ok && result.data) {
      setUserCollections(result.data)
    } else {
      setUserCollections([])
    }
    setShowCollectionModal(true)
  }
  
  // 컬렉션에 추가 핸들러
  const handleAddToCollection = async (collectionId) => {
    const result = await addNovelCollectionApi(collectionId, id)
    if (result.ok) {
      alert('컬렉션에 추가되었습니다!')
      setShowCollectionModal(false)
    } else {
      alert('컬렉션 추가에 실패했습니다. 이미 추가된 작품일 수 있습니다.')
    }
  }
  
  // 새 컬렉션 생성 후 소설 추가
  const handleCreateAndAddCollection = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId || !newCollectionName.trim()) return
    
    const createData = {
      userId: userId,
      collectionName: newCollectionName,
      content: ''
    }
    
    const createResult = await createCollectionApi(createData)
    if (createResult.ok && createResult.data) {
      // 생성된 컬렉션에 소설 추가
      const addResult = await addNovelCollectionApi(createResult.data, id)
      if (addResult.ok) {
        alert('새 컬렉션이 생성되고 소설이 추가되었습니다!')
        setShowCollectionModal(false)
        setShowNewCollectionForm(false)
        setNewCollectionName('')
      } else {
        alert('컬렉션은 생성되었지만 소설 추가에 실패했습니다.')
      }
    } else {
      alert('컬렉션 생성에 실패했습니다.')
    }
  }

  if (loading || !novelData) {
    return (
      <div className={styles.pageContainer}>
        <Header/>
        <div className={styles.contentArea}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Header/>
      <div className={styles.contentArea}>
        <div className={styles.mainLayout}>
          {/* 왼쪽: 책 이미지 */}
          <div className={styles.bookSection}>
            <div className={styles.bookCover}>
              <img src={novelData.img} alt={novelData.title} />
            </div>
            <div className={styles.bookInfo}>
              <span className={styles.genre}>{novelData.genre}</span>
              <h2 className={styles.title}>{novelData.title}</h2>
              <p className={styles.author}>{novelData.author}</p>
              <p className={styles.platform}>📱 {novelData.platform}</p>
            </div>
          </div>
          
          {/* 오른쪽: 평점 및 리뷰 */}
          <div className={styles.reviewSection}>
            <div className={styles.ratingHeader}>
              <h3 className={styles.avgRating}>
                평균 ⭐ {novelData.avgStars.toFixed(1)} ({novelData.totalReviews}명)
              </h3>
              <button className={styles.rateButton} onClick={handleOpenCollectionModal}>📚 컬렉션 추가</button>
            </div>
            
            {/* 별점 분포 */}
            <div className={styles.starDistribution}>
              {starDistribution.map((item) => (
                <div key={item.star} className={styles.starRow}>
                  <span className={styles.starLabel}>{"⭐".repeat(item.star)}</span>
                  <div className={styles.starBar}>
                    <div 
                      className={styles.starBarFill} 
                      style={{ width: `${(item.count / novelData.totalReviews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* 리뷰 작성 버튼 */}
            <div className={styles.reviewActionBar}>
              <button 
                className={styles.writeReviewButton}
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? '취소' : '✏️ 리뷰 작성하기'}
              </button>
            </div>
            
            {/* 리뷰 작성 폼 */}
            {showReviewForm && (
              <form className={styles.reviewForm} onSubmit={handleCreateReview}>
                <div className={styles.ratingInput}>
                  <label>별점:</label>
                  <select 
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                  >
                    {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((r) => (
                      <option key={r} value={r}>⭐ {r}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  className={styles.reviewTextarea}
                  placeholder="리뷰를 작성해주세요..."
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                  required
                />
                <button type="submit" className={styles.submitReviewButton}>리뷰 등록</button>
              </form>
            )}
            
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
            
            {/* 리뷰 목록 */}
            <div className={styles.reviewList}>
              {reviews.length === 0 ? (
                <div className={styles.emptyReviews}>아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.userInfo}>
                        <div 
                          className={styles.userClickable}
                          onClick={() => handleUserClick(review.userId)}
                        >
                          <div className={styles.userAvatar}>{review.user?.charAt(0) || '?'}</div>
                          <div>
                            <span className={styles.userName}>{review.user}</span>
                            <span className={styles.userLevel}>LV.{review.level}</span>
                          </div>
                        </div>
                        <span className={styles.reviewRating}>{"⭐".repeat(Math.floor(review.rating))}</span>
                      </div>
                      {/* 본인의 리뷰 또는 관리자일 경우에만 수정/삭제 버튼 표시 */}
                      {canManageReview(review.userId) && (
                        <div className={styles.reviewManageButtons}>
                          <button 
                            className={styles.editButton}
                            onClick={() => handleUpdateReview(review.id)}
                          >
                            ✏️ 수정
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            🗑️ 삭제
                          </button>
                        </div>
                      )}
                    </div>
                    <p className={styles.reviewContent}>{review.content}</p>
                    <div className={styles.reviewFooter}>
                      <span className={styles.reviewDate}>{review.date}</span>
                      <div className={styles.reviewActions}>
                        <button 
                          className={styles.likeButton}
                          onClick={() => handleAddLike(review.id)}
                        >
                          👍 공감 {review.likes || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 컬렉션 선택 모달 */}
      {showCollectionModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCollectionModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>컬렉션에 추가</h3>
              <button className={styles.closeButton} onClick={() => setShowCollectionModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {/* 새 컬렉션 생성 버튼/폼 */}
              {!showNewCollectionForm ? (
                <button 
                  className={styles.newCollectionButton}
                  onClick={() => setShowNewCollectionForm(true)}
                >
                  ➕ 새 컬렉션 만들기
                </button>
              ) : (
                <form className={styles.newCollectionForm} onSubmit={handleCreateAndAddCollection}>
                  <input
                    type="text"
                    placeholder="컬렉션 이름"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    required
                    autoFocus
                  />
                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.createBtn}>생성</button>
                    <button 
                      type="button" 
                      className={styles.cancelBtn}
                      onClick={() => {
                        setShowNewCollectionForm(false)
                        setNewCollectionName('')
                      }}
                    >
                      취소
                    </button>
                  </div>
                </form>
              )}
              
              {/* 기존 컬렉션 목록 */}
              {userCollections.length === 0 ? (
                <div className={styles.emptyCollections}>
                  <p>기존 컬렉션이 없습니다. 위에서 새 컬렉션을 만들어보세요!</p>
                </div>
              ) : (
                <div className={styles.collectionList}>
                  {userCollections.map((collection) => (
                    <div 
                      key={collection.collectionId} 
                      className={styles.collectionItem}
                      onClick={() => handleAddToCollection(collection.collectionId)}
                    >
                      <span className={styles.collectionName}>{collection.collectionName}</span>
                      <span className={styles.collectionCount}>{collection.novelCount || 0}권</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
