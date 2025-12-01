import api from "../instance"
//전체 웹소설 목록 조회
export const readNovelApi = async()=>{
  try{
    const response = await api.get(`/novels`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//웹소설 상세 조회
export const readDetailNovelApi = async(novelId)=>{
  try{
    const response = await api.get(`/novels/${novelId}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error('소설 상세 조회 실패:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    } else if (error.request) {
      console.error('요청 전송 실패:', error.request);
    } else {
      console.error('에러 메시지:', error.message);
    }
    return {ok:false, data: null, error: error.message};
  }
}
//웹소설 검색
export const searchNovelApi = async(keyword) => {
  try {
    const response = await api.get(`/novels/search?keyword=${encodeURIComponent(keyword)}`); // 절대 경로로 변경
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}
//장르별 웹소설 검색
export const searchGenreNovelApi = async(genre)=>{
  try{
    const response = await api.get(`/novels/genre/${genre}`); // 절대 경로로 변경
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}