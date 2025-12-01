#!/bin/bash

# 백엔드 프로세스 종료 스크립트

echo "포트 8080을 사용하는 프로세스를 찾는 중..."

# Windows에서 포트 8080을 사용하는 프로세스 찾기
PID=$(netstat -ano | findstr :8080 | findstr LISTENING | awk '{print $5}' | head -1)

if [ -z "$PID" ]; then
    echo "포트 8080을 사용하는 프로세스가 없습니다."
    exit 0
fi

echo "프로세스 PID: $PID 종료 중..."
taskkill /F /PID $PID

if [ $? -eq 0 ]; then
    echo "✓ 백엔드 프로세스가 종료되었습니다."
else
    echo "❌ 프로세스 종료 실패"
    exit 1
fi

