import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './CollectionDetail.module.scss'
import { Header } from '../../components/Header'
import { Bird } from '../../assets'
import { readCollectionDetailApi, deleteNovelCollectionApi, saveCollectionApi, unsaveCollectionApi } from '../../apis/collections/collections'

export const CollectionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collectionData, setCollectionData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 현재 로그인한 유저 정보
  const currentUserId = localStorage.getItem('userId')
  const userRole = localStorage.getItem('userRole')
  const isAdmin = userRole === 'ADMIN'
  
  // 컬렉션 관리 권한 확인 (소유자 또는 관리자)
  const canManageCollection = () => {
    if (!currentUserId || !collectionData) return false
    return isAdmin || currentUserId === String(collectionData.userId)
  }
  
  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformCollectionData = (data) => {
    // 소설 목록 변환
    const novels = (data.novels || []).map(novel => ({
      id: novel.novelId,
      title: novel.novelName,
      author: novel.novelAuthor,
      genre: novel.genre,
      status: novel.novelStatus === 'COMPLETED' ? '완결작' : '연재중',
      stars: 0 // TODO: 평점 정보 추가 필요
    }))
    
    return {
      id: data.collectionId,
      userId: data.userId,
      name: data.collectionName,
      description: data.content || '',
      userName: data.userName,
      novelCount: data.novelCount || novels.length,
      saveCount: data.saveCount || 0,
      isSaved: data.isSaved || false,
      novels: novels
    }
  }
  
  // API 호출: 컬렉션 상세 정보 조회
  const fetchCollectionDetail = async () => {
    setLoading(true)
    
    const result = await readCollectionDetailApi(id, currentUserId)
    if (result.ok && result.data) {
      const transformed = transformCollectionData(result.data)
      setCollectionData(transformed)
    } else {
      // API 실패 시 기본 데이터
      setCollectionData({
        id: id,
        name: '컬렉션',
        description: '',
        novels: []
      })
    }
    
    setLoading(false)
  }
  
  useEffect(() => {
    fetchCollectionDetail()
  }, [id])
  
  // 컬렉션 저장/저장취소 핸들러
  const handleSaveToggle = async () => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      return
    }
    
    if (collectionData.isSaved) {
      const result = await unsaveCollectionApi(id, currentUserId)
      if (result.ok) {
        fetchCollectionDetail()
      } else {
        alert('저장 취소에 실패했습니다.')
      }
    } else {
      const result = await saveCollectionApi(id, currentUserId)
      if (result.ok) {
        fetchCollectionDetail()
      } else {
        alert('저장에 실패했습니다.')
      }
    }
  }
  
  // 컬렉션에서 작품 제거 핸들러
  const handleRemoveNovel = async (novelId) => {
    if (!confirm('이 작품을 컬렉션에서 제거하시겠습니까?')) return
    
    const result = await deleteNovelCollectionApi(id, novelId)
    if (result.ok) {
      alert('컬렉션에서 제거되었습니다!')
      // 컬렉션 정보 새로고침
      const collectionResult = await readCollectionApi(id)
      if (collectionResult.ok) {
        setCollectionData(collectionResult.data)
      }
    } else {
      alert('작품 제거에 실패했습니다.')
    }
  }
  
  // 작품 카드 클릭 핸들러
  const handleNovelClick = (novelId) => {
    navigate(`/detail/${novelId}`)
  }
  
  if (loading || !collectionData) {
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
        {/* 컬렉션 헤더 */}
        <div className={styles.collectionHeader}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← 돌아가기
          </button>
          <div className={styles.collectionInfo}>
            <h1 className={styles.collectionName}>{collectionData.name}</h1>
            <p className={styles.collectionDescription}>{collectionData.description}</p>
            <div className={styles.collectionStats}>
              <span className={styles.collectionCount}>
                📖 총 {collectionData.novelCount || collectionData.novels?.length || 0}권
              </span>
              <span className={styles.saveCount}>
                💾 {collectionData.saveCount || 0}명이 저장
              </span>
            </div>
            {currentUserId && String(collectionData.userId) !== currentUserId && (
              <button 
                className={`${styles.saveButton} ${collectionData.isSaved ? styles.saved : ''}`}
                onClick={handleSaveToggle}
              >
                {collectionData.isSaved ? '✓ 저장됨' : '+ 저장하기'}
              </button>
            )}
          </div>
        </div>
        
        {/* 작품 그리드 */}
        <div className={styles.novelsGrid}>
          {collectionData.novels && collectionData.novels.length > 0 ? (
            collectionData.novels.map((novel) => (
              <div key={novel.id} className={styles.novelCard}>
                <div 
                  className={styles.novelImage}
                  onClick={() => handleNovelClick(novel.id)}
                >
                  <img src={Bird} alt={novel.title} />
                </div>
                <div className={styles.novelInfo}>
                  <h3 
                    className={styles.novelTitle}
                    onClick={() => handleNovelClick(novel.id)}
                  >
                    {novel.title}
                  </h3>
                  <p className={styles.novelAuthor}>{novel.author}</p>
                  <div className={styles.novelMeta}>
                    <span className={styles.novelGenre}>{novel.genre}</span>
                    <span className={styles.novelStars}>⭐ {novel.stars}</span>
                  </div>
                  {canManageCollection() && (
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveNovel(novel.id)}
                    >
                      🗑️ 제거
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyMessage}>
              <p>이 컬렉션에 작품이 없습니다.</p>
              <p className={styles.emptyHint}>웹소설 상세 페이지에서 '컬렉션 추가' 버튼을 눌러 작품을 추가해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

