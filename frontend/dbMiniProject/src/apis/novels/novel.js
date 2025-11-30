import api from "../instance"
//전체 웹소설 목록 조회
export const readNovelApi = async()=>{
  try{
    const response = await api.get(`novels`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//웹소설 상세 조회
export const readDetailNovelApi = async(novelId)=>{
  try{
    const response = await api.get(`novels/${novelId}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//웹소설 검색
export const searchNovelApi = async(keyword) => {
  try {
    const response = await api.get(`novels/search?keyword=${encodeURIComponent(keyword)}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}
//장르별 웹소설 검색
export const searchGenreNovelApi = async(genre)=>{
  try{
    const response = await api.get(`novels/genre/${genre}`);
    return {ok:true, data:response.data};
  }catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}