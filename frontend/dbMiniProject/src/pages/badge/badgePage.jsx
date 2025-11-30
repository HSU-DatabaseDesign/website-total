import { useState, useEffect } from 'react'
import styles from './badgePage.module.scss'
import { Header } from '../../components/Header'
import { Check5, Check10, Check30, Read5, Read10, Read30, Revuew5, Revuew10, Revuew30 } from '../../assets'
import { readAllBadgesApi, readUserBadgeProgressApi } from '../../apis/badges/badges'

export const BadgePage = () => {
  const [loading, setLoading] = useState(true)
  const [allBadges, setAllBadges] = useState([])
  const [userProgress, setUserProgress] = useState({})
  
  // localStorage에서 userId 가져오기
  const userId = localStorage.getItem('userId')
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  // 배지 타입별 이미지 매핑
  // 출석, 팔로워 -> check / 리뷰 -> review / 컬렉션 -> read
  const badgeImages = {
    'LOGIN_DAYS': { 5: Check5, 10: Check10, 30: Check30 },
    'FOLLOW_COUNT': { 5: Check5, 10: Check10, 30: Check30 },
    'REVIEW_COUNT': { 5: Revuew5, 10: Revuew10, 30: Revuew30 },
    'COLLECTION_COUNT': { 5: Read5, 10: Read10, 30: Read30 }
  }
  
  // 배지 타입별 카테고리 매핑
  const badgeCategories = {
    'LOGIN_DAYS': '출석',
    'FOLLOW_COUNT': '팔로워',
    'REVIEW_COUNT': '리뷰',
    'COLLECTION_COUNT': '컬렉션'
  }

  // API에서 배지 데이터 가져오기
  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true)
      
      // 로그인된 경우 진행률 API 사용 (unlocked 정보 포함)
      if (isLoggedIn && userId) {
        const progressResult = await readUserBadgeProgressApi(userId)
        console.log('배지 진행률 API 응답:', progressResult)
        if (progressResult.ok && progressResult.data?.badges) {
          // 진행률 API 응답을 allBadges로 사용
          setAllBadges(progressResult.data.badges)
          // progressMap도 생성
          const progressMap = {}
          progressResult.data.badges.forEach(b => {
            console.log('배지 데이터:', b.badgeId, b.badgeName, 'unlocked:', b.unlocked)
            progressMap[b.badgeId] = {
              currentValue: b.currentValue || 0,
              isUnlocked: b.unlocked === true
            }
          })
          console.log('최종 progressMap:', progressMap)
          setUserProgress(progressMap)
        }
      } else {
        // 비로그인 시 전체 배지 목록만 조회
        const allResult = await readAllBadgesApi()
        if (allResult.ok) {
          setAllBadges(allResult.data || [])
        }
      }
      
      setLoading(false)
    }
    
    fetchBadges()
  }, [userId, isLoggedIn])

  // 배지 데이터 변환 (API 데이터 -> UI 데이터)
  const badges = allBadges.map(badge => {
    const category = badgeCategories[badge.badgeType] || '기타'
    const typeImages = badgeImages[badge.badgeType]
    const image = typeImages?.[badge.conditionValue] || typeImages?.default || Check5
    
    // 로그인된 경우 진행률 정보 가져오기
    const progress = userProgress[badge.badgeId] || { currentValue: 0, isUnlocked: false }
    
    return {
      id: badge.badgeId,
      name: badge.badgeName,
      description: badge.badgeMission || `${badge.conditionValue}개 달성`,
      category: category,
      image: image,
      requirement: badge.conditionValue || 0,
      current: progress.currentValue,
      isUnlocked: progress.isUnlocked,
      badgeType: badge.badgeType
    }
  })
  
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const categories = ['전체', '출석', '팔로워', '리뷰', '컬렉션']
  
  const filteredBadges = selectedCategory === '전체' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory)
  
  const unlockedCount = badges.filter(b => b.isUnlocked).length
  
  if (loading) {
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
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>배지 컬렉션</h1>
          <p className={styles.pageSubtitle}>
            {isLoggedIn 
              ? `미션을 완료하고 배지를 획득하세요! (보유: ${unlockedCount}/${badges.length}개)`
              : `로그인하면 배지 진행률을 확인할 수 있어요! (총 ${badges.length}개)`
            }
          </p>
        </div>
        
        {/* 카테고리 필터 */}
        <nav className={styles.categoryNav}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
        
        {/* 배지 그리드 */}
        <div className={styles.badgeGrid}>
          {filteredBadges.map((badge) => {
            const progressPercent = badge.requirement > 0 
              ? Math.min((badge.current / badge.requirement) * 100, 100) 
              : 0
            
            return (
              <div 
                key={badge.id} 
                className={`${styles.badgeCard} ${!badge.isUnlocked ? styles.locked : ''}`}
              >
                <div className={styles.badgeImageWrapper}>
                  <img 
                    src={badge.image} 
                    alt={badge.name} 
                    className={styles.badgeImage}
                    style={{ opacity: badge.isUnlocked ? 1 : 0.35 }}
                  />
                  {badge.isUnlocked && (
                    <div className={styles.unlockedCheck}>✓</div>
                  )}
                </div>
                
                <div className={styles.badgeInfo}>
                  <h3 className={styles.badgeName}>{badge.name}</h3>
                  <p className={styles.badgeDescription}>{badge.description}</p>
                  
                  {/* 진행률 바 - 로그인된 경우에만 표시 */}
                  {isLoggedIn && badge.requirement > 0 && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div 
                          className={`${styles.progressFill} ${badge.isUnlocked ? styles.completed : ''}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {badge.isUnlocked ? '완료!' : `${badge.current} / ${badge.requirement}`}
                      </span>
                    </div>
                  )}
                  
                  {/* 비로그인 시 조건만 표시 */}
                  {!isLoggedIn && badge.requirement > 0 && (
                    <div className={styles.progressSection}>
                      <span className={styles.progressText}>
                        목표: {badge.requirement}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
