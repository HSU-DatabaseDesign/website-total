import api from "../instance"

// 전체 작가 목록 조회
export const readAllAuthorsApi = async () => {
  try {
    const response = await api.get('authors')
    return { ok: true, data: response.data }
  } catch (error) {
    console.error(error)
    return { ok: false, data: null }
  }
}

// 작가 프로필 조회
export const readAuthorApi = async (userId) => {
  try {
    const response = await api.get(`authors/${userId}`)
    return { ok: true, data: response.data }
  } catch (error) {
    console.error(error)
    return { ok: false, data: null }
  }
}
