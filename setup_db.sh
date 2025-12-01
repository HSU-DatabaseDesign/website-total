#!/bin/bash

echo "========================================"
echo "MySQL 데이터베이스 초기화 시작"
echo "========================================"

# application.yml에 설정된 비밀번호 사용 (기본값: test1234)
MYSQL_PASSWORD="test1234"

echo ""
echo "MySQL root 비밀번호: $MYSQL_PASSWORD 사용"
echo "※ 비밀번호가 다르면 backend/src/main/resources/application.yml 파일을 수정하세요"
echo ""

# MySQL 클라이언트 경로 찾기
MYSQL_CMD="mysql"

# 먼저 PATH에서 mysql 명령어 확인
if ! command -v mysql &> /dev/null 2>&1; then
    # Windows 환경 감지
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || -n "$WINDIR" || -n "$MSYSTEM" ]]; then
        echo "⚠️  MySQL 클라이언트를 PATH에서 찾을 수 없습니다."
        echo ""
        echo "Windows 환경에서 일반적인 MySQL 설치 경로를 확인 중..."
        
        # Windows 경로 탐색 (Git Bash 형식)
        COMMON_PATHS=(
            "/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe"
            "/c/Program Files/MySQL/MySQL Server 8.1/bin/mysql.exe"
            "/c/Program Files/MySQL/MySQL Server 8.2/bin/mysql.exe"
            "/c/Program Files (x86)/MySQL/MySQL Server 8.0/bin/mysql.exe"
            "/c/Program Files (x86)/MySQL/MySQL Server 8.1/bin/mysql.exe"
        )
        
        MYSQL_FOUND=false
        for path in "${COMMON_PATHS[@]}"; do
            if [ -f "$path" ]; then
                MYSQL_CMD="$path"
                echo "✓ MySQL 클라이언트 발견: $path"
                MYSQL_FOUND=true
                break
            fi
        done
        
        # 여전히 찾지 못한 경우
        if [ "$MYSQL_FOUND" = false ]; then
            echo ""
            echo "❌ MySQL 클라이언트를 자동으로 찾을 수 없습니다."
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "【해결 방법 1】 MySQL Workbench 사용 (가장 간단) ⭐"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "   1. MySQL Workbench 실행"
            echo "   2. 로컬 MySQL 서버에 연결 (root/test1234)"
            echo "   3. File > Open SQL Script → init_complete.sql 선택"
            echo "   4. ⚡ 번개 아이콘 클릭하여 실행"
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "【해결 방법 2】 MySQL 경로 직접 입력"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            read -p "MySQL 설치 경로를 입력하세요 (예: C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe): " CUSTOM_PATH
            
            if [ -z "$CUSTOM_PATH" ]; then
                echo ""
                echo "❌ 경로가 입력되지 않았습니다."
                echo "MySQL Workbench를 사용하시거나, 나중에 다시 시도해주세요."
                exit 1
            fi
            
            # Windows 경로를 Git Bash 경로로 변환
            if [[ "$CUSTOM_PATH" =~ ^[Cc]: ]]; then
                # C:/Program Files/... -> /c/Program Files/...
                CUSTOM_PATH="/$(echo ${CUSTOM_PATH:2} | sed 's|\\|/|g')"
            fi
            
            if [ -f "$CUSTOM_PATH" ]; then
                MYSQL_CMD="$CUSTOM_PATH"
                echo "✓ MySQL 클라이언트 사용: $MYSQL_CMD"
            else
                echo ""
                echo "❌ 지정한 경로에 MySQL 클라이언트가 없습니다:"
                echo "   입력한 경로: $CUSTOM_PATH"
                echo ""
                echo "MySQL Workbench 사용을 권장합니다."
                exit 1
            fi
        fi
    else
        # Linux/Mac 환경
        echo "❌ MySQL 클라이언트를 찾을 수 없습니다."
        echo "MySQL을 설치하거나 PATH에 추가해주세요."
        exit 1
    fi
fi

# 완전 초기화 (DB 생성 + 테이블 스키마 + 샘플 데이터)
echo ""
echo "데이터베이스 생성, 테이블 스키마, 샘플 데이터 삽입 중..."
"$MYSQL_CMD" -u root -p"$MYSQL_PASSWORD" --default-character-set=utf8mb4 < init_complete.sql

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 초기화 실패!"
    echo ""
    echo "가능한 원인:"
    echo "1. MySQL 비밀번호가 다릅니다 → backend/src/main/resources/application.yml 파일 확인"
    echo "2. MySQL 서버가 실행 중이 아닙니다 → MySQL 서버를 시작하세요"
    echo "3. MySQL Workbench를 사용하는 것을 권장합니다 (위 안내 참조)"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ 모든 작업 완료!"
echo "========================================"
