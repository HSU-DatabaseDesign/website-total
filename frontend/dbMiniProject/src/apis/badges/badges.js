import api from "../instance"

// 전체 배지 목록 조회
export const readAllBadgesApi = async() => {
  try {
    const response = await api.get("badges");
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 활성 배지 목록 조회
export const readActiveBadgesApi = async() => {
  try {
    const response = await api.get("badges/active");
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 특정 배지 조회
export const readBadgeApi = async(badgeId) => {
  try {
    const response = await api.get(`badges/${badgeId}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 유저 배지 목록 조회
export const readUserBadgesApi = async(userId) => {
  try {
    const response = await api.get(`badges/users/${userId}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 배지 생성 (관리자용)
export const createBadgeApi = async(badgeData) => {
  try {
    const response = await api.post("badges", badgeData);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 배지 수정 (관리자용)
export const updateBadgeApi = async(badgeId, badgeData) => {
  try {
    const response = await api.put(`badges/${badgeId}`, badgeData);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 배지 삭제 (관리자용)
export const deleteBadgeApi = async(badgeId) => {
  try {
    const response = await api.delete(`badges/${badgeId}`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}

// 유저 배지 진행률 조회
export const readUserBadgeProgressApi = async(userId) => {
  try {
    const response = await api.get(`badges/users/${userId}/progress`);
    return { ok: true, data: response.data };
  } catch(error) {
    console.error(error);
    return { ok: false, data: null };
  }
}
