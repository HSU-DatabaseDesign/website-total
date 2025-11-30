import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyPage.module.scss'
import { Header } from '../../components/Header'
import { Empty, Check5, Check10, Check30, Read5, Read10, Read30, Revuew5, Revuew10, Revuew30 } from '../../assets'
import { readUserApi, updateUserApi, deleteUserApi } from '../../apis/users/users'
import { readUserCollectionApi, createCollectionApi, updateCollectionApi, deleteCollectionApi, readSavedCollectionsApi, unsaveCollectionApi } from '../../apis/collections/collections'
import { addFollowApi, deleteFollowApi, readFollowingApi, readFollowersApi } from '../../apis/follow/follow'
import { readUserBadgesApi } from '../../apis/badges/badges'
import { readUserReviewsApi } from '../../apis/reviews/reviews'

export const MyPage = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // TODO: 실제 인증 상태로 변경
  const [userData, setUserData] = useState(null)
  const [myCollections, setMyCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', email: '' })
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [showCollectionForm, setShowCollectionForm] = useState(false)
  const [collectionForm, setCollectionForm] = useState({ name: '', description: '' })
  const [editingCollectionId, setEditingCollectionId] = useState(null)
  const [userBadges, setUserBadges] = useState([])
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followTab, setFollowTab] = useState('following') // 'following' or 'followers'
  const [savedCollections, setSavedCollections] = useState([])
  
  // 백엔드 컬렉션 데이터를 프론트엔드 형식으로 변환
  const transformCollectionData = (collections) => {
    return collections.map(collection => ({
      id: collection.collectionId,
      name: collection.collectionName,
      count: collection.novelCount || 0,
      coverImages: [Empty], // 기본 이미지
      description: collection.content || ''
    }))
  }
  
  // 임시 기본 데이터 (API 실패 시 사용)
  const defaultUserData = {
    username: '독서왕',
    email: 'reader@novelnet.com',
    joinDate: '2024.01.15',
    reviewCount: 0,
    collectionCount: 0,
    badgeCount: 0
  }
  
  // 리뷰 데이터 (API에서 가져옴)
  const [myReviews, setMyReviews] = useState([])
  
  const tabs = ['내 리뷰', '내 컬렉션', '저장한 컬렉션', '내 배지']
  
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
  
  // API 호출: 사용자 정보 및 컬렉션 조회
  useEffect(() => {
    // 로그인 체크
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    
    if (!loggedIn) {
      alert('로그인이 필요합니다')
      navigate('/login')
      return
    }
    
    const fetchUserData = async () => {
      setLoading(true)
      
      // localStorage에서 userId 가져오기
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('로그인이 필요합니다')
        navigate('/login')
        return
      }
      
      // 사용자 정보 조회
      const userResult = await readUserApi(userId)
      if (userResult.ok && userResult.data) {
        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const transformedUser = {
          username: userResult.data.nickname || userResult.data.name,
          email: userResult.data.email,
          joinDate: '2024.01.15', // TODO: 백엔드에서 가입일 추가 필요
          reviewCount: 0, // TODO: 백엔드에서 리뷰 수 추가 필요
          ratingCount: 0, // TODO: 백엔드에서 별점 수 추가 필요
          collectionCount: 0 // TODO: 백엔드에서 컬렉션 수 추가 필요
        };
        setUserData(transformedUser);
      } else {
        setUserData(defaultUserData)
      }
      
      // 사용자의 컬렉션 조회
      const collectionResult = await readUserCollectionApi(userId)
      if (collectionResult.ok && collectionResult.data) {
        const transformedCollections = transformCollectionData(collectionResult.data)
        setMyCollections(transformedCollections)
      } else {
        setMyCollections([])
      }
      
      // 사용자의 배지 조회
      const badgeResult = await readUserBadgesApi(userId)
      console.log('배지 조회 userId:', userId, '결과:', badgeResult)
      if (badgeResult.ok && badgeResult.data) {
        setUserBadges(badgeResult.data.badges || [])
      } else {
        setUserBadges([])
      }
      
      // 팔로잉/팔로워 목록 조회
      const followingResult = await readFollowingApi(userId)
      if (followingResult.ok && followingResult.data) {
        setFollowing(followingResult.data)
      }
      
      const followersResult = await readFollowersApi(userId)
      if (followersResult.ok && followersResult.data) {
        setFollowers(followersResult.data)
      }
      
      // 사용자의 리뷰 조회
      const reviewsResult = await readUserReviewsApi(userId)
      if (reviewsResult.ok && reviewsResult.data) {
        const transformedReviews = reviewsResult.data.map(review => ({
          id: review.reviewId,
          bookTitle: review.novelName,
          bookImg: Empty,
          rating: review.star,
          content: review.content,
          date: '최근',
          likes: review.likeCount || 0
        }))
        setMyReviews(transformedReviews)
      }
      
      // 저장한 컬렉션 조회
      const savedResult = await readSavedCollectionsApi(userId)
      if (savedResult.ok && savedResult.data) {
        const transformedSaved = savedResult.data.map(c => ({
          id: c.collectionId,
          name: c.collectionName,
          count: c.novelCount || 0,
          saveCount: c.saveCount || 0,
          coverImages: [Empty],
          description: c.content || '',
          owner: c.userName,
          userId: c.userId
        }))
        setSavedCollections(transformedSaved)
      }
      
      setLoading(false)
    }
    
    fetchUserData()
  }, [isLoggedIn, navigate])
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    return (
      <>
        {"⭐".repeat(fullStars)}
        {hasHalfStar && "✨"}
      </>
    )
  }
  
  // 회원 정보 수정 핸들러
  const handleUpdateUser = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId') || 1
    
    // 백엔드 API는 PUT 요청에 데이터가 필요함
    // passwd를 null로 보내면 백엔드에서 비밀번호를 변경하지 않음
    const updateData = {
      name: editForm.username,
      email: editForm.email,
      passwd: null, // null로 보내야 비밀번호가 유지됨
      nickname: editForm.username
    };
    
    const result = await updateUserApi(userId, updateData)
    if (result.ok) {
      alert('회원 정보가 수정되었습니다!')
      setShowEditForm(false)
      // 사용자 정보 새로고침
      const userResult = await readUserApi(userId)
      if (userResult.ok && userResult.data) {
        const transformedUser = {
          username: userResult.data.nickname || userResult.data.name,
          email: userResult.data.email,
          joinDate: userData.joinDate,
          reviewCount: userData.reviewCount,
          ratingCount: userData.ratingCount,
          collectionCount: userData.collectionCount
        };
        setUserData(transformedUser);
      }
    } else {
      alert('회원 정보 수정에 실패했습니다.')
    }
  }
  
  // 회원 탈퇴 핸들러
  const handleDeleteUser = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return
    
    const userId = localStorage.getItem('userId') || 1
    const result = await deleteUserApi(userId)
    if (result.ok) {
      // 로그아웃 처리
      localStorage.removeItem('userId')
      localStorage.removeItem('userLoginId')
      localStorage.removeItem('isLoggedIn')
      alert('회원 탈퇴가 완료되었습니다.')
      navigate('/login')
    } else {
      alert('회원 탈퇴에 실패했습니다.')
    }
  }
  
  // 팔로우 추가 핸들러
  const handleAddFollow = async (targetId) => {
    const followerId = localStorage.getItem('userId') || 1
    const result = await addFollowApi(followerId, targetId)
    if (result.ok) {
      alert('팔로우 되었습니다!')
      // 팔로잉 목록 새로고침
      const followingResult = await readFollowingApi(followerId)
      if (followingResult.ok) {
        setFollowing(followingResult.data)
      }
    }
  }
  
  // 팔로우 삭제 핸들러
  const handleDeleteFollow = async (targetId) => {
    const followerId = localStorage.getItem('userId') || 1
    const result = await deleteFollowApi(followerId, targetId)
    if (result.ok) {
      alert('언팔로우 되었습니다!')
      // 팔로잉 목록 새로고침
      const followingResult = await readFollowingApi(followerId)
      if (followingResult.ok) {
        setFollowing(followingResult.data)
      }
    }
  }
  
  // 팔로우 모달 열기
  const openFollowModal = (tab) => {
    setFollowTab(tab)
    setShowFollowModal(true)
  }
  
  // 컬렉션 생성 핸들러
  const handleCreateCollection = async (e) => {
    e.preventDefault()
    
    const userId = localStorage.getItem('userId') || 1
    // 백엔드 CollectionCreateDto 형식에 맞게 데이터 구성
    const createData = {
      userId: userId,
      collectionName: collectionForm.name,
      content: collectionForm.description
    }
    
    const result = await createCollectionApi(createData)
    if (result.ok) {
      alert('컬렉션이 생성되었습니다!')
      setShowCollectionForm(false)
      setCollectionForm({ name: '', description: '' })
      // 컬렉션 목록 새로고침
      const collectionResult = await readUserCollectionApi(userId)
      if (collectionResult.ok && collectionResult.data) {
        const transformedCollections = transformCollectionData(collectionResult.data)
        setMyCollections(transformedCollections)
      }
    } else {
      alert('컬렉션 생성에 실패했습니다.')
    }
  }
  
  // 컬렉션 수정 핸들러
  const handleUpdateCollection = async (collectionId) => {
    // 백엔드 CollectionUpdateDto 형식에 맞게 데이터 구성
    const updateData = {
      collectionName: collectionForm.name,
      content: collectionForm.description
    }
    
    const result = await updateCollectionApi(collectionId, updateData)
    if (result.ok) {
      alert('컬렉션이 수정되었습니다!')
      setShowCollectionForm(false)
      setEditingCollectionId(null)
      setCollectionForm({ name: '', description: '' })
      // 컬렉션 목록 새로고침
      const userId = localStorage.getItem('userId') || 1
      const collectionResult = await readUserCollectionApi(userId)
      if (collectionResult.ok && collectionResult.data) {
        const transformedCollections = transformCollectionData(collectionResult.data)
        setMyCollections(transformedCollections)
      }
    } else {
      alert('컬렉션 수정에 실패했습니다.')
    }
  }
  
  // 컬렉션 삭제 핸들러
  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('정말 이 컬렉션을 삭제하시겠습니까?')) return
    
    const result = await deleteCollectionApi(collectionId)
    if (result.ok) {
      alert('컬렉션이 삭제되었습니다!')
      // 컬렉션 목록 새로고침
      const userId = localStorage.getItem('userId') || 1
      const collectionResult = await readUserCollectionApi(userId)
      if (collectionResult.ok && collectionResult.data) {
        const transformedCollections = transformCollectionData(collectionResult.data)
        setMyCollections(transformedCollections)
      }
    } else {
      alert('컬렉션 삭제에 실패했습니다.')
    }
  }
  
  // 컬렉션 수정 모드 시작
  const handleEditCollectionClick = (collection) => {
    setEditingCollectionId(collection.id)
    setCollectionForm({ name: collection.name, description: collection.description || '' })
    setShowCollectionForm(true)
  }
  
  // 컬렉션 카드 클릭 핸들러
  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`)
  }
  
  // 저장한 컬렉션 저장 취소 핸들러
  const handleUnsaveCollection = async (collectionId) => {
    if (!window.confirm('이 컬렉션 저장을 취소하시겠습니까?')) return
    
    const userId = localStorage.getItem('userId') || 1
    const result = await unsaveCollectionApi(collectionId, userId)
    if (result.ok) {
      // 저장한 컬렉션 목록 새로고침
      const savedResult = await readSavedCollectionsApi(userId)
      if (savedResult.ok && savedResult.data) {
        const transformedSaved = savedResult.data.map(c => ({
          id: c.collectionId,
          name: c.collectionName,
          count: c.novelCount || 0,
          saveCount: c.saveCount || 0,
          coverImages: [Empty],
          description: c.content || '',
          owner: c.userName,
          userId: c.userId
        }))
        setSavedCollections(transformedSaved)
      }
    } else {
      alert('저장 취소에 실패했습니다.')
    }
  }

  if (loading || !userData) {
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
        {/* 사용자 프로필 */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarCircle}>
              {userData.username.charAt(0)}
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.username}>{userData.username}</h2>
            <p className={styles.email}>{userData.email}</p>
            <p className={styles.joinDate}>가입일: {userData.joinDate}</p>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{myReviews.length}</span>
              <span className={styles.statLabel}>리뷰</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{myCollections.length}</span>
              <span className={styles.statLabel}>컬렉션</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userBadges.length}</span>
              <span className={styles.statLabel}>배지</span>
            </div>
          </div>
          <div className={styles.profileActions}>
            <button 
              className={styles.editButton}
              onClick={() => {
                setShowEditForm(!showEditForm)
                setEditForm({ username: userData.username, email: userData.email })
              }}
            >
              ✏️ 정보 수정
            </button>
            <button 
              className={styles.deleteButton}
              onClick={handleDeleteUser}
            >
              🗑️ 회원 탈퇴
            </button>
          </div>
          <div className={styles.followSection}>
            <button 
              className={styles.followButton}
              onClick={() => openFollowModal('following')}
            >
              팔로잉 {following.length}
            </button>
            <button 
              className={styles.followButton}
              onClick={() => openFollowModal('followers')}
            >
              팔로워 {followers.length}
            </button>
          </div>
        </div>
        
        {/* 회원 정보 수정 폼 */}
        {showEditForm && (
          <form className={styles.editForm} onSubmit={handleUpdateUser}>
            <h3>회원 정보 수정</h3>
            <div className={styles.formGroup}>
              <label>사용자 이름</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>이메일</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>저장</button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowEditForm(false)}>취소</button>
            </div>
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
        
        {/* 컨텐츠 영역 */}
        <div className={styles.contentSection}>
          {/* 내 리뷰 */}
          {selectedTab === 0 && (
            <div className={styles.reviewList}>
              {myReviews.length === 0 ? (
                <div className={styles.emptyReviews}>
                  아직 작성한 리뷰가 없습니다. 웹소설을 읽고 리뷰를 작성해보세요!
                </div>
              ) : (
                myReviews.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <img src={review.bookImg || Empty} alt={review.bookTitle} className={styles.bookCover} />
                    <div className={styles.reviewContent}>
                      <h3 className={styles.bookTitle}>{review.bookTitle}</h3>
                      <div className={styles.reviewRating}>
                        {renderStars(review.rating)}
                        <span className={styles.ratingValue}>{review.rating}</span>
                      </div>
                      <p className={styles.reviewText}>{review.content}</p>
                      <div className={styles.reviewFooter}>
                        <span className={styles.reviewDate}>{review.date}</span>
                        <span className={styles.reviewLikes}>👍 {review.likes}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* 내 컬렉션 */}
          {selectedTab === 1 && (
            <>
              {/* 컬렉션 생성 버튼 */}
              <div className={styles.collectionActions}>
                <button 
                  className={styles.createCollectionButton}
                  onClick={() => {
                    setShowCollectionForm(!showCollectionForm)
                    setEditingCollectionId(null)
                    setCollectionForm({ name: '', description: '' })
                  }}
                >
                  ➕ 새 컬렉션 만들기
                </button>
              </div>
              
              {/* 컬렉션 생성/수정 폼 */}
              {showCollectionForm && (
                <form 
                  className={styles.collectionForm} 
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (editingCollectionId) {
                      handleUpdateCollection(editingCollectionId)
                    } else {
                      handleCreateCollection(e)
                    }
                  }}
                >
                  <h3>{editingCollectionId ? '컬렉션 수정' : '새 컬렉션'}</h3>
                  <div className={styles.formGroup}>
                    <label>컬렉션 이름</label>
                    <input
                      type="text"
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm({...collectionForm, name: e.target.value})}
                      placeholder="예: 좋아하는 판타지"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>설명</label>
                    <textarea
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({...collectionForm, description: e.target.value})}
                      placeholder="이 컬렉션에 대한 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveButton}>
                      {editingCollectionId ? '수정' : '생성'}
                    </button>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={() => {
                        setShowCollectionForm(false)
                        setEditingCollectionId(null)
                        setCollectionForm({ name: '', description: '' })
                      }}
                    >
                      취소
                    </button>
                  </div>
                </form>
              )}
              
              {/* 컬렉션 목록 */}
              <div className={styles.collectionList}>
                {myCollections.length === 0 ? (
                  <div className={styles.emptyCollections}>
                    아직 컬렉션이 없습니다. 새 컬렉션을 만들어보세요!
                  </div>
                ) : (
                  myCollections.map((collection) => (
                    <div key={collection.id} className={styles.collectionCard}>
                      <div 
                        className={styles.collectionCovers}
                        onClick={() => handleCollectionClick(collection.id)}
                      >
                        {collection.coverImages && collection.coverImages.map((img, idx) => (
                          <img key={idx} src={img} alt={`book ${idx}`} className={styles.coverImg} />
                        ))}
                      </div>
                      <div className={styles.collectionInfo}>
                        <h3 
                          className={styles.collectionName}
                          onClick={() => handleCollectionClick(collection.id)}
                        >
                          {collection.name}
                        </h3>
                        <p className={styles.collectionDescription}>{collection.description}</p>
                        <span className={styles.collectionCount}>{collection.count}권</span>
                        <div className={styles.collectionButtons}>
                          <button 
                            className={styles.editCollectionButton}
                            onClick={() => handleEditCollectionClick(collection)}
                          >
                            ✏️ 수정
                          </button>
                          <button 
                            className={styles.deleteCollectionButton}
                            onClick={() => handleDeleteCollection(collection.id)}
                          >
                            🗑️ 삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          
          {/* 저장한 컬렉션 */}
          {selectedTab === 2 && (
            <div className={styles.collectionList}>
              {savedCollections.length === 0 ? (
                <div className={styles.emptyCollections}>
                  저장한 컬렉션이 없습니다. 다른 사용자의 컬렉션을 둘러보고 저장해보세요!
                </div>
              ) : (
                savedCollections.map((collection) => (
                  <div key={collection.id} className={styles.collectionCard}>
                    <div 
                      className={styles.collectionCovers}
                      onClick={() => handleCollectionClick(collection.id)}
                    >
                      {collection.coverImages && collection.coverImages.map((img, idx) => (
                        <img key={idx} src={img} alt={`book ${idx}`} className={styles.coverImg} />
                      ))}
                    </div>
                    <div className={styles.collectionInfo}>
                      <h3 
                        className={styles.collectionName}
                        onClick={() => handleCollectionClick(collection.id)}
                      >
                        {collection.name}
                      </h3>
                      <p className={styles.collectionDescription}>{collection.description}</p>
                      <div className={styles.collectionMeta}>
                        <span 
                          className={styles.collectionOwner}
                          onClick={() => navigate(`/user/${collection.userId}`)}
                        >
                          by {collection.owner}
                        </span>
                        <span className={styles.collectionCount}>📖 {collection.count}권</span>
                        <span className={styles.collectionSaveCount}>💾 {collection.saveCount}</span>
                      </div>
                      <div className={styles.collectionButtons}>
                        <button 
                          className={styles.unsaveButton}
                          onClick={() => handleUnsaveCollection(collection.id)}
                        >
                          ✕ 저장 취소
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* 내 배지 */}
          {selectedTab === 3 && (
            <div className={styles.badgeSection}>
              <div className={styles.badgeHeader}>
                <h3>획득한 배지 ({userBadges.length}개)</h3>
                <button 
                  className={styles.viewAllBadgesButton}
                  onClick={() => navigate('/badge')}
                >
                  전체 배지 보기 →
                </button>
              </div>
              <div className={styles.badgeGrid}>
                {userBadges.length === 0 ? (
                  <div className={styles.emptyBadges}>
                    아직 획득한 배지가 없습니다. 활동을 통해 배지를 획득해보세요!
                  </div>
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
            </div>
          )}
        </div>
        
        {/* 팔로우 모달 */}
        {showFollowModal && (
          <div className={styles.modalOverlay} onClick={() => setShowFollowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTabs}>
                  <button 
                    className={`${styles.modalTab} ${followTab === 'following' ? styles.active : ''}`}
                    onClick={() => setFollowTab('following')}
                  >
                    팔로잉 ({following.length})
                  </button>
                  <button 
                    className={`${styles.modalTab} ${followTab === 'followers' ? styles.active : ''}`}
                    onClick={() => setFollowTab('followers')}
                  >
                    팔로워 ({followers.length})
                  </button>
                </div>
                <button className={styles.closeButton} onClick={() => setShowFollowModal(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                {followTab === 'following' ? (
                  following.length === 0 ? (
                    <div className={styles.emptyFollow}>팔로잉하는 사용자가 없습니다.</div>
                  ) : (
                    following.map((user) => (
                      <div key={user.userId} className={styles.followItem}>
                        <div className={styles.followAvatar}>{user.nickname?.charAt(0) || user.name?.charAt(0)}</div>
                        <div className={styles.followInfo}>
                          <span className={styles.followName}>{user.nickname || user.name}</span>
                        </div>
                        <button 
                          className={styles.unfollowButton}
                          onClick={() => handleDeleteFollow(user.userId)}
                        >
                          언팔로우
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  followers.length === 0 ? (
                    <div className={styles.emptyFollow}>팔로워가 없습니다.</div>
                  ) : (
                    followers.map((user) => (
                      <div key={user.userId} className={styles.followItem}>
                        <div className={styles.followAvatar}>{user.nickname?.charAt(0) || user.name?.charAt(0)}</div>
                        <div className={styles.followInfo}>
                          <span className={styles.followName}>{user.nickname || user.name}</span>
                        </div>
                        <button 
                          className={styles.followBackButton}
                          onClick={() => handleAddFollow(user.userId)}
                        >
                          팔로우
                        </button>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

