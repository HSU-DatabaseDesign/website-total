#!/bin/bash

echo "========================================"
echo "백엔드 서버 시작"
echo "========================================"

cd backend

# gradlew 실행 권한 부여
chmod +x gradlew

echo "Gradle 빌드 및 서버 시작 중..."
./gradlew bootRun

cd ..
