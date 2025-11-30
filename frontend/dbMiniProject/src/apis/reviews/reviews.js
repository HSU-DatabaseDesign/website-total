import api from "../instance"

//리뷰 상세 조회
export const readReviewApi = async(reviewId)=>{
  try{
    const response=await api.get(`reviews/${reviewId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//사용자별 리뷰 목록 조회
export const readUserReviewsApi = async(userId)=>{
  try{
    const response = await api.get(`reviews/user/${userId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//전체 리뷰 목록 조회 (최신순)
export const readAllReviewsApi = async()=>{
  try{
    const response = await api.get(`reviews`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//리뷰 수정
export const updateReviewApi = async(reviewId, reviewData)=>{
  try{
    const response=await api.put(`reviews/${reviewId}`, reviewData);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//리뷰 삭제
export const deleteReviewApi = async(reviewId)=>{
  try{
    const response=await api.delete(`reviews/${reviewId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//리뷰 작성
export const createReviewApi = async(reviewData)=>{
  try{
    const response=await api.post(`reviews`, reviewData);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//좋아요 추가
export const addLikeApi = async(reviewId, userId)=>{
  try{
    const response=await api.post(`reviews/${reviewId}/like?userId=${userId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//좋아요 삭제
export const deleteLikeApi = async(reviewId, userId)=>{
  try{
    const response=await api.delete(`reviews/${reviewId}/like?userId=${userId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//웹소설 별 리뷰 목록 조회
export const readNovelReveiwApi = async(novelId)=>{
  try{
    const response=await api.get(`reviews/novel/${novelId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}