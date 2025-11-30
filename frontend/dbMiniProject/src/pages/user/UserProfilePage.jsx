import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './UserProfilePage.module.scss'
import { Header } from '../../components/Header'
import { Novel1, Novel2, Novel3, Novel4, Novel5, Novel6, Novel7, Novel8, Novel9, Novel10, Novel11, Novel12, Novel13, Novel14, Novel15, Novel16, Novel17, Novel18, Novel19, Novel20, Empty, Check5, Check10, Check30, Read5, Read10, Read30, Revuew5, Revuew10, Revuew30 } from '../../assets'
import { readUserApi } from '../../apis/users/users'
import { readUserReviewsApi } from '../../apis/reviews/reviews'
import { readUserCollectionApi, readCollectionDetailApi } from '../../apis/collections/collections'
import { addFollowApi, deleteFollowApi, readFollowingApi, readFollowersApi } from '../../apis/follow/follow'
import { readAuthorApi } from '../../apis/authors/authors'
import { readUserBadgesApi } from '../../apis/badges/badges'

// 소설 ID에 맞는 이미지 가져오기 (컴포넌트 외부에 정의)
const getNovelImage = (novelId) => {
  const novelImages = {
    1: Novel1, 2: Novel2, 3: Novel3, 4: Novel4, 5: Novel5,
    6: Novel6, 7: Novel7, 8: Novel8, 9: Novel9, 10: Novel10,
    11: Novel11, 12: Novel12, 13: Novel13, 14: Novel14, 15: Novel15,
    16: Novel16, 17: Novel17, 18: Novel18, 19: Novel19, 20: Novel20,
  };
  return novelImages[novelId] || Empty;
};

export const UserProfilePage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isAuthor, setIsAuthor] = useState(false)
  const [authorInfo, setAuthorInfo] = useState(null)
  const [reviews, setReviews] = useState([])
  const [collections, setCollections] = useState([])
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [userBadges, setUserBadges] = useState([])

  const tabs = isAuthor ? ['작품', '리뷰', '컬렉션', '배지'] : ['리뷰', '컬렉션', '배지']
  
  // 배지 타입별 이미지 매핑 (배지 페이지와 동일)
  // 출석, 팔로워 -> check / 리뷰 -> review / 컬렉션 -> read
  const getBadgeImage = (badge) => {
    const badgeImages = {
      'LOGIN_DAYS': { 5: Check5, 10: Check10, 30: Check30 },
      'FOLLOW_COUNT': { 5: Check5, 10: Check10, 30: Check30 },
      'REVIEW_COUNT': { 5: Revuew5, 10: Revuew10, 30: Revuew30 },
      'COLLECTION_COUNT': { 5: Read5, 10: Read10, 30: Read30 }
    }
    const typeImages = badgeImages[badge.badgeType]
    if (!typeImages) return Check5
    return typeImages[badge.conditionValue] || typeImages.default || Check5
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      
      const currentUserId = localStorage.getItem('userId')
      setIsOwnProfile(currentUserId === userId)

      // 유저 정보 조회
      const userResult = await readUserApi(userId)
      if (userResult.ok && userResult.data) {
        setUser(userResult.data)
      }

      // 작가인지 확인
      const authorResult = await readAuthorApi(userId)
      if (authorResult.ok && authorResult.data) {
        setIsAuthor(true)
        setAuthorInfo(authorResult.data)
      }

      // 유저의 리뷰 조회
      const reviewsResult = await readUserReviewsApi(userId)
      if (reviewsResult.ok && reviewsResult.data) {
        setReviews(reviewsResult.data)
      }

      // 유저의 컬렉션 조회
      const collectionsResult = await readUserCollectionApi(userId)
      if (collectionsResult.ok && collectionsResult.data) {
        // 각 컬렉션의 커버 이미지 설정
        const collectionsWithImages = await Promise.all(
          collectionsResult.data.map(async (collection) => {
            let coverImage = Empty
            
            // 컬렉션에 소설이 있으면 첫 번째 소설 이미지 가져오기
            if (collection.novelCount > 0) {
              const detailResult = await readCollectionDetailApi(collection.collectionId, currentUserId)
              if (detailResult.ok && detailResult.data && detailResult.data.novels && detailResult.data.novels.length > 0) {
                const firstNovelId = detailResult.data.novels[0].novelId
                coverImage = getNovelImage(firstNovelId)
              }
            }
            
            return {
              ...collection,
              coverImage
            }
          })
        )
        setCollections(collectionsWithImages)
      }

      // 팔로잉/팔로워 조회
      const followingResult = await readFollowingApi(userId)
      if (followingResult.ok && followingResult.data) {
        setFollowing(followingResult.data)
      }

      const followersResult = await readFollowersApi(userId)
      if (followersResult.ok && followersResult.data) {
        setFollowers(followersResult.data)
      }

      // 현재 로그인한 유저가 이 유저를 팔로우하고 있는지 확인
      if (currentUserId && currentUserId !== userId) {
        const myFollowingResult = await readFollowingApi(currentUserId)
        if (myFollowingResult.ok && myFollowingResult.data) {
          const isFollowingUser = myFollowingResult.data.some(
            f => f.userId === parseInt(userId)
          )
          setIsFollowing(isFollowingUser)
        }
      }

      // 유저의 배지 조회
      const badgesResult = await readUserBadgesApi(userId)
      if (badgesResult.ok && badgesResult.data) {
        setUserBadges(badgesResult.data.badges || [])
      }

      setLoading(false)
    }

    fetchUserData()
  }, [userId])

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
        setFollowers(prev => prev.filter(f => f.userId !== parseInt(currentUserId)))
      }
    } else {
      // 팔로우
      const result = await addFollowApi(currentUserId, userId)
      if (result.ok) {
        setIsFollowing(true)
        // 팔로워 목록 새로고침
        const followersResult = await readFollowersApi(userId)
        if (followersResult.ok) {
          setFollowers(followersResult.data)
        }
      }
    }
  }

  const handleNovelClick = (novelId) => {
    navigate(`/detail/${novelId}`)
  }

  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`)
  }

  if (loading || !user) {
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
        {/* 유저 프로필 헤더 */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <span>{user.nickname?.charAt(0) || user.name?.charAt(0) || '?'}</span>
          </div>
          <div className={styles.profileInfo}>
            {isAuthor && <div className={styles.authorBadge}>✍️ 작가</div>}
            <h1 className={styles.userName}>{user.nickname || user.name}</h1>
            {isAuthor && authorInfo && (
              <p className={styles.penName}>필명: {authorInfo.penName}</p>
            )}
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{reviews.length}</span>
              <span className={styles.statLabel}>리뷰</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{collections.length}</span>
              <span className={styles.statLabel}>컬렉션</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{followers.length}</span>
              <span className={styles.statLabel}>팔로워</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{following.length}</span>
              <span className={styles.statLabel}>팔로잉</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userBadges.length}</span>
              <span className={styles.statLabel}>배지</span>
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
          {/* 작품 탭 (작가인 경우에만) */}
          {isAuthor && selectedTab === 0 && (
            <div className={styles.novelGrid}>
              {!authorInfo?.novels || authorInfo.novels.length === 0 ? (
                <div className={styles.emptyMessage}>작성한 작품이 없습니다.</div>
              ) : (
                authorInfo.novels.map((novel) => (
                  <div 
                    key={novel.novelId} 
                    className={styles.novelCard}
                    onClick={() => handleNovelClick(novel.novelId)}
                  >
                    <div className={styles.novelCover}>
                      <img src={getNovelImage(novel.novelId)} alt={novel.novelName} />
                    </div>
                    <div className={styles.novelInfo}>
                      <h3 className={styles.novelTitle}>{novel.novelName}</h3>
                      <p className={styles.novelGenre}>{novel.genre}</p>
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
          {selectedTab === (isAuthor ? 1 : 0) && (
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
          {selectedTab === (isAuthor ? 2 : 1) && (
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

          {/* 배지 탭 */}
          {selectedTab === (isAuthor ? 3 : 2) && (
            <div className={styles.badgeGrid}>
              {userBadges.length === 0 ? (
                <div className={styles.emptyMessage}>획득한 배지가 없습니다.</div>
              ) : (
                userBadges.map((badge) => (
                  <div key={badge.badgeId} className={styles.badgeCard}>
                    <div className={styles.badgeImage}>
                      <img src={getBadgeImage(badge)} alt={badge.badgeName} />
                    </div>
                    <div className={styles.badgeInfo}>
                      <h4 className={styles.badgeName}>{badge.badgeName}</h4>
                      <p className={styles.badgeMission}>{badge.badgeMission}</p>
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
