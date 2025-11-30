import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AuthorListPage.module.scss'
import { Header } from '../../components/Header'
import { readAllAuthorsApi } from '../../apis/authors/authors'

export const AuthorListPage = () => {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true)
      const result = await readAllAuthorsApi()
      if (result.ok && result.data) {
        setAuthors(result.data)
      } else {
        // 임시 데이터
        setAuthors([
          { userId: 5, penName: '이영도', nationality: '대한민국', debutYear: '1998', brief: '판타지 소설의 거장' }
        ])
      }
      setLoading(false)
    }
    fetchAuthors()
  }, [])

  const handleAuthorClick = (userId) => {
    navigate(`/author/${userId}`)
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>✍️ 작가</h1>
          <p className={styles.pageSubtitle}>소설넷에 등록된 작가들을 만나보세요!</p>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : authors.length === 0 ? (
          <div className={styles.emptyMessage}>등록된 작가가 없습니다.</div>
        ) : (
          <div className={styles.authorGrid}>
            {authors.map((author) => (
              <div 
                key={author.userId} 
                className={styles.authorCard}
                onClick={() => handleAuthorClick(author.userId)}
              >
                <div className={styles.authorAvatar}>
                  {author.profileImage ? (
                    <img src={author.profileImage} alt={author.penName} />
                  ) : (
                    <span>{author.penName?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <h3 className={styles.penName}>{author.penName}</h3>
                  <p className={styles.nationality}>{author.nationality}</p>
                  <p className={styles.debutYear}>데뷔: {author.debutYear}년</p>
                  <p className={styles.brief}>{author.brief}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
