#!/bin/bash

echo "========================================"
echo "전체 서버 시작"
echo "========================================"

# 백엔드 서버를 백그라운드로 시작
echo ""
echo "[1/2] 백엔드 서버 시작 중..."
cd backend

# gradlew 실행 권한 부여
chmod +x gradlew

./gradlew bootRun > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "✓ 백엔드 서버 시작됨 (PID: $BACKEND_PID)"
echo "   로그: backend.log"

# 잠시 대기 (백엔드가 먼저 시작되도록)
sleep 5

# 프론트엔드 서버 시작
echo ""
echo "[2/2] 프론트엔드 서버 시작 중..."
cd frontend/dbMiniProject

# node_modules가 없으면 npm install 실행
if [ ! -d "node_modules" ]; then
    echo "의존성 설치 중 (npm install)..."
    npm install
fi

npm run dev

cd ../..
