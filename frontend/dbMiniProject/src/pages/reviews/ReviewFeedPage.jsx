import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ReviewFeedPage.module.scss'
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
import { readNovelApi } from '../../apis/novels/novel'
import { readAllReviewsApi, addLikeApi } from '../../apis/reviews/reviews'

export const ReviewFeedPage = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('likes') // likes, ratingHigh, ratingLow

  // 전체 리뷰 가져오기
  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true)
      
      // 전체 리뷰 목록 가져오기
      const reviewsResult = await readAllReviewsApi()
      if (reviewsResult.ok && reviewsResult.data) {
        // 모든 소설 목록 가져와서 리뷰에 소설 정보 매핑
        const novelsResult = await readNovelApi()
        const novelsMap = {}
        if (novelsResult.ok && novelsResult.data) {
          novelsResult.data.forEach(novel => {
            novelsMap[novel.novelId] = novel
          })
        }
        
        // 리뷰에 소설 정보 추가
        const reviewsWithNovel = reviewsResult.data.map(review => {
          const novel = novelsMap[review.novelId]
          return {
            ...review,
            novelImg: novel ? getNovelImage(novel.novelId) : Empty,
            novelGenre: novel ? novel.genre : '알 수 없음'
          }
        })
        
        // 정렬 (기본: 공감순)
        reviewsWithNovel.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        setReviews(reviewsWithNovel)
      } else {
        setReviews([])
      }
      
      setLoading(false)
    }

    fetchAllReviews()
  }, [])


  // 정렬 변경 핸들러
  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const sorted = [...reviews]
    
    switch(newSort) {
      case 'likes':
        // 공감순 (좋아요 수 내림차순)
        sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        break
      case 'ratingHigh':
        // 높은평점순 (평점 내림차순)
        sorted.sort((a, b) => (b.star || 0) - (a.star || 0))
        break
      case 'ratingLow':
        // 낮은평점순 (평점 오름차순)
        sorted.sort((a, b) => (a.star || 0) - (b.star || 0))
        break
      default:
        break
    }
    setReviews(sorted)
  }

  // 좋아요 핸들러
  const handleLike = async (reviewId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    const result = await addLikeApi(reviewId, userId)
    if (result.ok) {
      // 좋아요 수 업데이트
      setReviews(prev => prev.map(review => 
        review.reviewId === reviewId 
          ? { ...review, likeCount: (review.likeCount || 0) + 1 }
          : review
      ))
    }
  }

  // 소설 상세 페이지로 이동
  const handleNovelClick = (novelId) => {
    navigate(`/detail/${novelId}`)
  }
  
  // 유저 프로필 페이지로 이동
  const handleUserClick = (e, userId) => {
    e.stopPropagation()
    navigate(`/user/${userId}`)
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>리뷰 피드</h1>
          <p className={styles.pageSubtitle}>다른 독자들의 생생한 리뷰를 확인해보세요! 📝</p>
        </div>

        {/* 정렬 옵션 */}
        <div className={styles.sortOptions}>
          <button 
            className={`${styles.sortButton} ${sortBy === 'likes' ? styles.active : ''}`}
            onClick={() => handleSortChange('likes')}
          >
            공감순
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'ratingHigh' ? styles.active : ''}`}
            onClick={() => handleSortChange('ratingHigh')}
          >
            높은평점순
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'ratingLow' ? styles.active : ''}`}
            onClick={() => handleSortChange('ratingLow')}
          >
            낮은평점순
          </button>
        </div>

        {/* 리뷰 목록 */}
        {loading ? (
          <div className={styles.loading}>리뷰를 불러오는 중...</div>
        ) : reviews.length === 0 ? (
          <div className={styles.emptyMessage}>아직 작성된 리뷰가 없습니다.</div>
        ) : (
          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <div key={review.reviewId} className={styles.reviewCard}>
                <div className={styles.novelInfo} onClick={() => handleNovelClick(review.novelId)}>
                  <img src={review.novelImg || Empty} alt={review.novelName} className={styles.novelCover} />
                  <div className={styles.novelDetails}>
                    <h3 className={styles.novelTitle}>{review.novelName}</h3>
                    <span className={styles.novelGenre}>{review.novelGenre}</span>
                  </div>
                </div>
                
                <div className={styles.reviewContent}>
                  <div className={styles.reviewHeader}>
                    <div 
                      className={styles.userInfo}
                      onClick={(e) => handleUserClick(e, review.userId)}
                    >
                      <div className={styles.userAvatar}>{review.userName?.charAt(0) || '?'}</div>
                      <span className={styles.userName}>{review.userName || '익명'}</span>
                    </div>
                    <div className={styles.reviewRating}>
                      {'⭐'.repeat(Math.floor(review.star || 0))}
                      <span className={styles.ratingValue}>{review.star || 0}</span>
                    </div>
                  </div>
                  
                  <p className={styles.reviewText}>{review.content}</p>
                  
                  <div className={styles.reviewFooter}>
                    <span className={styles.reviewViews}>👁 {review.views || 0}</span>
                    <button 
                      className={styles.likeButton}
                      onClick={() => handleLike(review.reviewId)}
                    >
                      👍 공감 {review.likeCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
