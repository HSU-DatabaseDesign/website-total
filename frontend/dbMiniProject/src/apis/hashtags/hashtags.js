import api from "../instance"

// 전체 해시태그 목록 조회
export const readAllHashtagsApi = async () => {
  try {
    console.log('해시태그 API 호출: /hashtags')
    const response = await api.get(`/hashtags`)
    console.log('해시태그 API 응답:', response.data)
    
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!doctype') || response.data.trim().startsWith('<!DOCTYPE'))) {
      console.error('해시태그 API가 HTML을 반환했습니다. 프록시 설정을 확인하세요.')
      return { ok: false, data: [], error: '프록시 오류: HTML 응답을 받았습니다.' }
    }
    
    return { ok: true, data: response.data }
  } catch (error) {
    console.error('해시태그 조회 API 오류:', error)
    if (error.response) {
      console.error('응답 상태:', error.response.status)
      console.error('응답 데이터:', error.response.data)
    } else if (error.request) {
      console.error('요청을 보냈으나 응답을 받지 못했습니다:', error.request)
    } else {
      console.error('요청 설정 중 오류 발생:', error.message)
    }
    return { ok: false, data: [], error: error.message }
  }
}

