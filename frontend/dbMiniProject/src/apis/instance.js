import axios from 'axios';

// Vite 프록시를 사용하므로 baseURL을 설정하지 않음
// 프록시가 /reviews, /novels 등의 경로를 http://localhost:8080으로 전달
const api = axios.create({
  baseURL: '', // 빈 문자열로 설정하여 상대 경로 사용 (프록시 작동)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 설정
});

export default api;