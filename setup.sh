#!/bin/bash

echo "========================================"
echo "WebNovelReviewSite 초기 설정"
echo "========================================"

# 1. 모든 sh 파일에 실행 권한 부여
echo ""
echo "[1/3] 스크립트 실행 권한 설정 중..."
chmod +x *.sh
chmod +x backend/gradlew
echo "✓ 실행 권한 설정 완료"

# 2. 프론트엔드 의존성 설치
echo ""
echo "[2/3] 프론트엔드 의존성 설치 중..."
cd frontend/dbMiniProject
npm install
cd ../..
echo "✓ 프론트엔드 의존성 설치 완료"

# 3. 데이터베이스 설정 여부 확인
echo ""
echo "[3/3] 데이터베이스 설정"
read -p "데이터베이스를 초기화하시겠습니까? (y/n): " DB_SETUP

if [ "$DB_SETUP" = "y" ] || [ "$DB_SETUP" = "Y" ]; then
    ./setup_db.sh
else
    echo "데이터베이스 초기화를 건너뜁니다."
    echo "나중에 ./setup_db.sh 를 실행하여 초기화할 수 있습니다."
fi

echo ""
echo "========================================"
echo "✓ 초기 설정 완료!"
echo ""
echo "사용 가능한 명령어:"
echo "  ./start_all.sh      - 백엔드 + 프론트엔드 동시 실행"
echo "  ./start_backend.sh  - 백엔드만 실행"
echo "  ./start_frontend.sh - 프론트엔드만 실행"
echo "  ./setup_db.sh       - 데이터베이스 초기화"
echo "========================================"
