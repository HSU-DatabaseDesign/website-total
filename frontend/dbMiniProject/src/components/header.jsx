import React, { useState, useEffect } from 'react'
import styles from './header.module.scss'
import { useNavigate } from 'react-router-dom'
import { MainIcon } from '../assets'
import { searchNovelApi } from '../apis/novels/novel'

export const Header = () => {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLoginId, setUserLoginId] = useState('')
  
  // 로그인 상태 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userName = localStorage.getItem('userName') || localStorage.getItem('userLoginId') || ''
    setIsLoggedIn(loggedIn)
    setUserLoginId(userName)
  }, [])
  
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchKeyword.trim()) return
    
    const result = await searchNovelApi(searchKeyword)
    if (result.ok && result.data) {
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const transformedResults = result.data.map(novel => ({
        id: novel.novelId,
        title: novel.novelName,
        author: novel.novelAuthor
      }))
      setSearchResults(transformedResults)
      setShowSearchResults(true)
    }
  }
  
  const handleSearchResultClick = (novelId) => {
    setShowSearchResults(false)
    setSearchKeyword('')
    navigate(`/detail/${novelId}`)
  }
  
  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userLoginId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setUserLoginId('')
    alert('로그아웃 되었습니다.')
    navigate('/')
  }
  
  return (
    <header className={styles.header}>
      <img src={MainIcon} className={styles.title}  
      alt='icon' onClick={() => navigate('/')} />
      
      {/* 검색 바 */}
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="웹소설 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
          onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>🔍</button>
        
        {/* 검색 결과 드롭다운 */}
        {showSearchResults && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((novel) => (
              <div
                key={novel.id}
                className={styles.searchResultItem}
                onClick={() => handleSearchResultClick(novel.id)}
              >
                <span className={styles.resultTitle}>{novel.title}</span>
                <span className={styles.resultAuthor}>{novel.author}</span>
              </div>
            ))}
          </div>
        )}
      </form>
      
      <nav className={styles.nav}>
        <div className={styles.navWrapper}>
          <div className={styles.navLeftItem}>
            <a onClick={() => navigate('/collections')}>컬렉션</a>
            <a onClick={() => navigate('/reviews')}>리뷰</a>
            <a onClick={() => navigate('/authors')}>작가</a>
          </div>
          <div className={styles.navRightItem}>
            {isLoggedIn ? (
              <>
                <span className={styles.userName}>{userLoginId}님</span>
                <a onClick={handleLogout}>로그아웃</a>
                <a onClick={() => navigate('/mypage')}>마이페이지</a>
                <a onClick={() => navigate('/badge')}>배지</a>
              </>
            ) : (
              <>
                <a onClick={() => navigate('/login')}>로그인</a>
                <a onClick={() => navigate('/register')}>회원가입</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
