import api from "../instance"

//컬랙션 상세 조회
export const readCollectionApi = async(collectionId)=>{
  try{
    const response=await api.get(`/collections/${collectionId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//컬랙션 상세 수정
export const updateCollectionApi = async(collectionId, collectionData)=>{
  try{
    const response=await api.put(`/collections/${collectionId}`, collectionData); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//컬랙션 삭제
export const deleteCollectionApi = async(collectionId)=>{
  try{
    const response=await api.delete(`/collections/${collectionId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//컬랙션 생성
export const createCollectionApi = async(collectionData)=>{
  try{
    const response=await api.post(`/collections`, collectionData); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//컬랙션에 작품 추가
export const addNovelCollectionApi = async(collectionId, novelId)=>{
  try{
    const response=await api.post(`/collections/${collectionId}/novels/${novelId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//컬랙션에 작품 삭제
export const deleteNovelCollectionApi = async(collectionId, novelId)=>{
  try{
    const response=await api.delete(`/collections/${collectionId}/novels/${novelId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//유저의 컬랙션 조회
export const readUserCollectionApi = async(userId)=>{
  try{
    const response=await api.get(`/collections/user/${userId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//전체 컬렉션 조회
export const readAllCollectionsApi = async(currentUserId = null)=>{
  try{
    const params = currentUserId ? { currentUserId } : {};
    const response=await api.get(`/collections`, { params }); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//컬렉션 상세 조회 (현재 유저 정보 포함)
export const readCollectionDetailApi = async(collectionId, currentUserId = null)=>{
  try{
    const params = currentUserId ? { currentUserId } : {};
    const response=await api.get(`/collections/${collectionId}/detail`, { params }); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//컬렉션 저장 (북마크)
export const saveCollectionApi = async(collectionId, userId)=>{
  try{
    const response=await api.post(`/collections/${collectionId}/save`, null, { params: { userId } }); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//컬렉션 저장 취소
export const unsaveCollectionApi = async(collectionId, userId)=>{
  try{
    const response=await api.delete(`/collections/${collectionId}/save`, { params: { userId } }); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}

//저장한 컬렉션 목록 조회
export const readSavedCollectionsApi = async(userId)=>{
  try{
    const response=await api.get(`/collections/saved/${userId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
