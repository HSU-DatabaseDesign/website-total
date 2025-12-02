#!/bin/bash

echo "========================================"
echo "웹소설 리뷰 사이트 서버 시작"
echo "========================================"

# 종료 시그널 핸들러 설정
cleanup() {
    echo ""
    echo "========================================"
    echo "서버 종료 중..."
    echo "========================================"
    
    # 백엔드 프로세스 종료
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        echo "백엔드 서버 종료 중 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
        echo "✓ 백엔드 서버 종료 완료"
    fi
    
    # 프론트엔드 프로세스 종료
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "프론트엔드 서버 종료 중 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
        echo "✓ 프론트엔드 서버 종료 완료"
    fi
    
    echo "========================================"
    echo "✓ 모든 서버 종료 완료"
    echo "========================================"
    exit 0
}

# SIGINT (Ctrl+C), SIGTERM 시그널 처리
trap cleanup SIGINT SIGTERM

# 기존 프로세스 종료
echo ""
echo "[준비] 기존 실행 중인 서버 확인 및 종료..."

# OS 타입 확인
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows 환경
    # 백엔드 종료 (포트 8080)
    PID=$(netstat -ano 2>/dev/null | grep ":8080" | grep "LISTENING" | tr -s ' ' | cut -d ' ' -f 5 | head -1)
    if [ ! -z "$PID" ] && [ "$PID" != "0" ]; then
        echo "  기존 백엔드 프로세스 종료 중 (PID: $PID)..."
        taskkill //F //PID $PID > /dev/null 2>&1
        sleep 2
    fi
    
    # 프론트엔드 종료 (포트 5173)
    PID=$(netstat -ano 2>/dev/null | grep ":5173" | grep "LISTENING" | tr -s ' ' | cut -d ' ' -f 5 | head -1)
    if [ ! -z "$PID" ] && [ "$PID" != "0" ]; then
        echo "  기존 프론트엔드 프로세스 종료 중 (PID: $PID)..."
        taskkill //F //PID $PID > /dev/null 2>&1
        sleep 2
    fi
else
    # Linux/Mac 환경
    # 백엔드 종료 (포트 8080)
    PID=$(lsof -ti:8080 2>/dev/null | head -1)
    if [ ! -z "$PID" ]; then
        echo "  기존 백엔드 프로세스 종료 중 (PID: $PID)..."
        kill -9 $PID > /dev/null 2>&1
        sleep 2
    fi
    
    # 프론트엔드 종료 (포트 5173)
    PID=$(lsof -ti:5173 2>/dev/null | head -1)
    if [ ! -z "$PID" ]; then
        echo "  기존 프론트엔드 프로세스 종료 중 (PID: $PID)..."
        kill -9 $PID > /dev/null 2>&1
        sleep 2
    fi
fi

echo "✓ 준비 완료"

# 프론트엔드 의존성 확인
echo ""
echo "[1/3] 프론트엔드 의존성 확인 중..."
cd frontend/dbMiniProject
if [ ! -d "node_modules" ]; then
    echo "의존성 설치 중 (npm install)..."
    npm install
else
    echo "✓ 의존성 이미 설치됨"
fi
cd ../..

# 백엔드 서버 시작
echo ""
echo "[2/3] 백엔드 서버 시작 중..."
cd backend
./gradlew bootRun > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "✓ 백엔드 서버 시작됨 (PID: $BACKEND_PID)"
echo "   로그: backend.log"

# 백엔드 준비 대기
echo ""
echo "백엔드 서버 준비 대기 중..."
MAX_WAIT=30
WAIT_COUNT=0
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8080/novels > /dev/null 2>&1; then
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
echo "[3/3] 프론트엔드 서버 시작 중..."
cd frontend/dbMiniProject
npm run dev &
FRONTEND_PID=$!
cd ../..
echo "✓ 프론트엔드 서버 시작됨 (PID: $FRONTEND_PID)"

echo ""
echo "========================================"
echo "✓ 모든 서버 시작 완료!"
echo "========================================"
echo ""
echo "접속 주소:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:8080"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"
echo "========================================"

# 프론트엔드 프로세스가 종료될 때까지 대기
wait $FRONTEND_PID
