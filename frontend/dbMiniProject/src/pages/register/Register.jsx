import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.scss'
import { Header } from '../../components/Header'
import { registerApi } from '../../apis/users/users'

export const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    passwd: '',
    confirmPassword: '',
    email: '',
    nickname: ''
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
    setError('')
    
    if (formData.passwd !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }
    
    setLoading(true)
    
    // confirmPassword는 API에 전송하지 않음
    const { confirmPassword, ...registerData } = formData
    const result = await registerApi(registerData)
    
    if (result.ok) {
      // 회원가입 성공
      alert('회원가입이 완료되었습니다!')
      navigate('/login')
    } else {
      // 회원가입 실패
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        <div className={styles.registerBox}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>소설넷의 회원이 되어보세요!</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                maxLength={20}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="id">아이디</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                maxLength={20}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                maxLength={254}
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
                placeholder="비밀번호를 입력하세요 (최대 20자)"
                maxLength={20}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                maxLength={20}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.terms}>
              <label className={styles.checkbox}>
                <input type="checkbox" required disabled={loading} />
                <span>
                  <a href="/terms" target="_blank">이용약관</a> 및 <a href="/privacy" target="_blank">개인정보처리방침</a>에 동의합니다
                </span>
              </label>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>

          <div className={styles.loginLink}>
            <span>이미 계정이 있으신가요?</span>
            <button 
              type="button" 
              className={styles.linkButton}
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

