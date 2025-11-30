import api from "../instance"

//팔로우 추가
export const addFollowApi = async(followerId, targetId) => {
  try {
    const response = await api.post(`follow?followerId=${followerId}&targetId=${targetId}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}
//팔로우 삭제
export const deleteFollowApi = async(followerId, targetId) => {
  try {
    const response = await api.delete(`follow?followerId=${followerId}&targetId=${targetId}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}
//팔로잉 목록 조회
export const readFollowingApi = async(userId) => {
  try {
    const response = await api.get(`follow/${userId}/following`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

//팔로워 목록 조회
export const readFollowersApi = async(userId) => {
  try {
    const response = await api.get(`follow/${userId}/followers`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}