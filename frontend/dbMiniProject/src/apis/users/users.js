import api from "../instance"
//login
export const loginApi = async(loginData)=>{
  try{
    const response = await api.post("users/login", loginData);
    return {ok:true, data:response.data};
  }
  catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//회원가입
export const registerApi = async(registerData)=>{
  try{
    const response = await api.post("users/signup", registerData);
    return {ok:true, data:response.data};
  }
  catch(error){
    console.error(error);
    return {ok:false, data: null};
  }
}
//회원 삭제
export const deleteUserApi = async(userId)=>{
  try{
    const response=await api.delete(`users/${userId}`);
    return {ok:true, data:response.data};
  }
  catch(error){
    console.error(error);
    return {ok:false, data:null};
  }
}
//회원 수정
export const updateUserApi = async(userId, updateData)=>{
  try{
    const response= await api.put(`users/${userId}`, updateData);
    return {ok:true, data:response.data};
  }
  catch(error){
    console.error(error);
    return {ok:false, data:null};
  }
}
//회원 조회
export const readUserApi = async(userId)=>{
  try{
    const response= await api.get(`users/${userId}`);
    return {ok:true, data:response.data};
  }
  catch(error){
    console.error(error);
    return {ok:false, data:null};
  }
}