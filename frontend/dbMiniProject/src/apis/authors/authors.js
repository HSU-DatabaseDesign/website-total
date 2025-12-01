import api from "../instance"

// 전체 작가 목록 조회
export const readAllAuthorsApi = async () => {
  try {
    const response = await api.get('/authors') // 절대 경로로 변경
    return { ok: true, data: response.data }
  } catch (error) {
    console.error(error)
    return { ok: false, data: null }
  }
}

// 작가 프로필 조회
export const readAuthorApi = async (userId) => {
  try {
    const response = await api.get(`/authors/${userId}`) // 절대 경로로 변경
    return { ok: true, data: response.data }
  } catch (error) {
    console.error(error)
    return { ok: false, data: null }
  }
}

// 작가 등록 신청
export const createAuthorApi = async (authorData) => {
  try {
    const response = await api.post('/authors', authorData)
    return { ok: true, data: response.data }
  } catch (error) {
    console.error('작가 등록 API 오류:', error)
    if (error.response) {
      return { ok: false, data: null, error: error.response.data?.message || '작가 등록에 실패했습니다.' }
    }
    return { ok: false, data: null, error: error.message }
  }
}

// 관리자용: 승인 대기 작가 목록 조회
export const readPendingAuthorsApi = async () => {
  try {
    const response = await api.get('/authors/pending')
    return { ok: true, data: response.data }
  } catch (error) {
    console.error('승인 대기 작가 조회 API 오류:', error)
    return { ok: false, data: [] }
  }
}

// 관리자용: 작가 승인
export const approveAuthorApi = async (userId) => {
  try {
    const response = await api.post(`/authors/${userId}/approve`)
    return { ok: true, data: response.data }
  } catch (error) {
    console.error('작가 승인 API 오류:', error)
    if (error.response) {
      return { ok: false, data: null, error: error.response.data?.message || '작가 승인에 실패했습니다.' }
    }
    return { ok: false, data: null, error: error.message }
  }
}
