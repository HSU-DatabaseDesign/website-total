import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ReviewFeedPage.module.scss'
import { Header } from '../../components/Header'
import { Bird } from '../../assets'
import { readNovelApi } from '../../apis/novels/novel'
import { readNovelReveiwApi, addLikeApi } from '../../apis/reviews/reviews'

export const ReviewFeedPage = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('latest') // latest, likes, rating

  // 모든 소설의 리뷰를 가져와서 합치기
  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true)
      
      // 먼저 모든 소설 목록 가져오기
      const novelsResult = await readNovelApi()
      if (!novelsResult.ok || !novelsResult.data) {
        setLoading(false)
        return
      }

      // 각 소설의 리뷰 가져오기
      const allReviews = []
      for (const novel of novelsResult.data) {
        const reviewsResult = await readNovelReveiwApi(novel.novelId)
        if (reviewsResult.ok && reviewsResult.data) {
          // 리뷰에 소설 정보 추가
          const reviewsWithNovel = reviewsResult.data.map(review => ({
            ...review,
            novelImg: Bird,
            novelGenre: novel.genre
          }))
          allReviews.push(...reviewsWithNovel)
        }
      }

      // 정렬 (기본: 최신순 - reviewId 역순)
      allReviews.sort((a, b) => b.reviewId - a.reviewId)
      setReviews(allReviews)
      setLoading(false)
    }

    fetchAllReviews()
  }, [])


  // 정렬 변경 핸들러
  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const sorted = [...reviews]
    
    switch(newSort) {
      case 'latest':
        sorted.sort((a, b) => b.reviewId - a.reviewId)
        break
      case 'likes':
        sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        break
      case 'rating':
        sorted.sort((a, b) => (b.star || 0) - (a.star || 0))
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
            className={`${styles.sortButton} ${sortBy === 'latest' ? styles.active : ''}`}
            onClick={() => handleSortChange('latest')}
          >
            최신순
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'likes' ? styles.active : ''}`}
            onClick={() => handleSortChange('likes')}
          >
            공감순
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'rating' ? styles.active : ''}`}
            onClick={() => handleSortChange('rating')}
          >
            높은평점순
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
                  <img src={review.novelImg || Bird} alt={review.novelName} className={styles.novelCover} />
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
