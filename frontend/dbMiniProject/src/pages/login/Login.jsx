import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.scss'
import { Header } from '../../components/Header'
import { loginApi, readUserApi } from '../../apis/users/users'

export const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: '',
    passwd: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // 입력 시 에러 메시지 초기화
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = await loginApi(formData)
    
    if (result.ok) {
      // 로그인 성공 - userId와 사용자 정보 저장
      const userId = result.data
      localStorage.setItem('userId', userId)
      localStorage.setItem('userLoginId', formData.id)
      localStorage.setItem('isLoggedIn', 'true')
      
      // 사용자 정보 조회해서 이름과 역할 저장
      const userResult = await readUserApi(userId)
      if (userResult.ok && userResult.data) {
        localStorage.setItem('userName', userResult.data.nickname || userResult.data.name)
        localStorage.setItem('userRole', userResult.data.role || 'USER')
      }
      
      alert('로그인 성공!')
      navigate('/')
    } else {
      // 로그인 실패
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>소설넷에 오신 것을 환영합니다!</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="id">아이디</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="passwd">비밀번호</label>
              <input
                type="password"
                id="passwd"
                name="passwd"
                value={formData.passwd}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
              </label>
              <button type="button" className={styles.linkButton}>
                비밀번호 찾기
              </button>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.signupLink}>
            <span>계정이 없으신가요?</span>
            <button 
              type="button" 
              className={styles.linkButton}
              onClick={() => navigate('/register')}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

