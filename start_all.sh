#!/bin/bash

echo "========================================"
echo "전체 서버 시작"
echo "========================================"

# 기존 백엔드 프로세스 종료
echo ""
echo "[0/2] 기존 백엔드 프로세스 확인 중..."

# OS 타입 확인
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows 환경
    # 포트 8080을 사용하는 프로세스 찾기
    # netstat 출력: TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       42308
    # 마지막 필드가 PID이므로 공백으로 split 후 마지막 값 추출
    PID=$(netstat -ano 2>/dev/null | grep ":8080" | grep "LISTENING" | tr -s ' ' | cut -d ' ' -f 5 | head -1)
    
    if [ ! -z "$PID" ] && [ "$PID" != "0" ]; then
        echo "기존 백엔드 프로세스 발견 (PID: $PID), 종료 중..."
        taskkill //F //PID $PID > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✓ 기존 백엔드 프로세스 종료 완료"
            sleep 2
        else
            echo "⚠️  프로세스 종료 실패 (무시하고 계속 진행)"
        fi
    else
        echo "✓ 실행 중인 백엔드 프로세스 없음"
    fi
else
    # Linux/Mac 환경
    PID=$(lsof -ti:8080 2>/dev/null | head -1)
    
    if [ ! -z "$PID" ]; then
        echo "기존 백엔드 프로세스 발견 (PID: $PID), 종료 중..."
        kill -9 $PID > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✓ 기존 백엔드 프로세스 종료 완료"
            sleep 2
        else
            echo "⚠️  프로세스 종료 실패 (무시하고 계속 진행)"
        fi
    else
        echo "✓ 실행 중인 백엔드 프로세스 없음"
    fi
fi

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

# 백엔드 서버가 완전히 시작될 때까지 대기
echo ""
echo "백엔드 서버 준비 대기 중..."
MAX_WAIT=30
WAIT_COUNT=0
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -s http://localhost:8080/novels > /dev/null 2>&1; then
        echo "✓ 백엔드 서버 준비 완료!"
        break
    fi
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
    echo -n "."
done
echo ""

if [ $WAIT_COUNT -eq $MAX_WAIT ]; then
    echo "⚠️  백엔드 서버 시작 대기 시간 초과 (30초)"
    echo "   백엔드가 시작 중일 수 있습니다. 계속 진행합니다..."
fi

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
