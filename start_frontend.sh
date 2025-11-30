#!/bin/bash

echo "========================================"
echo "프론트엔드 서버 시작"
echo "========================================"

cd frontend/dbMiniProject

# node_modules가 없으면 npm install 실행
if [ ! -d "node_modules" ]; then
    echo "의존성 설치 중 (npm install)..."
    npm install
fi

echo "프론트엔드 개발 서버 시작 중..."
npm run dev

cd ../..
