import api from "../instance"

//리뷰 상세 조회
export const readReviewApi = async(reviewId)=>{
  try{
    const response=await api.get(`/reviews/${reviewId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//사용자별 리뷰 목록 조회
export const readUserReviewsApi = async(userId)=>{
  try{
    const response = await api.get(`/reviews/user/${userId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//전체 리뷰 목록 조회 (최신순)
export const readAllReviewsApi = async()=>{
  try{
    const response = await api.get(`/reviews`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//리뷰 수정
export const updateReviewApi = async(reviewId, reviewData)=>{
  try{
    const response=await api.put(`/reviews/${reviewId}`, reviewData); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//리뷰 삭제
export const deleteReviewApi = async(reviewId)=>{
  try{
    const response=await api.delete(`/reviews/${reviewId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//리뷰 작성
export const createReviewApi = async(reviewData)=>{
  try{
    const response=await api.post(`/reviews`, reviewData); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//좋아요 추가
export const addLikeApi = async(reviewId, userId)=>{
  try{
    const response=await api.post(`/reviews/${reviewId}/like?userId=${userId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//좋아요 삭제
export const deleteLikeApi = async(reviewId, userId)=>{
  try{
    const response=await api.delete(`/reviews/${reviewId}/like?userId=${userId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//웹소설 별 리뷰 목록 조회
export const readNovelReveiwApi = async(novelId)=>{
  try{
    const response=await api.get(`/reviews/novel/${novelId}`); // 절대 경로로 변경 (프록시 작동)
    // 응답 데이터가 배열인지 확인
    const data = response.data;
    
    // HTML 응답인 경우 (프록시 오류) - 문자열인지 먼저 확인
    if (typeof data === 'string') {
      const trimmedData = data.trim();
      if (trimmedData.startsWith('<!doctype') || trimmedData.startsWith('<!DOCTYPE')) {
        console.error('리뷰 API가 HTML을 반환했습니다. 프록시 설정을 확인하세요.');
        return {ok:false, data: null, error: '프록시 오류: HTML 응답을 받았습니다.'};
      }
    }
    
    // 배열인지 확인
    if (!Array.isArray(data)) {
      console.warn('리뷰 API 응답이 배열이 아닙니다:', typeof data, data);
      // 빈 배열 반환 (에러가 아닌 경우)
      return {ok:true, data: []};
    }
    
    console.log(`소설 ${novelId}의 리뷰 ${data.length}개 조회 성공`);
    return {ok:true, data: data};
  }catch(error){
    console.error('리뷰 조회 API 오류:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
      // HTML 응답인 경우
      if (typeof error.response.data === 'string') {
        const trimmedData = error.response.data.trim();
        if (trimmedData.startsWith('<!doctype') || trimmedData.startsWith('<!DOCTYPE')) {
          console.error('프록시가 제대로 작동하지 않습니다. 백엔드 서버가 실행 중인지 확인하세요.');
        }
      }
    } else if (error.request) {
      console.error('요청이 전송되지 않았습니다. 백엔드 서버 연결을 확인하세요.');
    } else {
      console.error('요청 설정 중 오류 발생:', error.message);
    }
    return {ok:false, data: null, error: error.message || '리뷰 조회 실패'};
  }
}