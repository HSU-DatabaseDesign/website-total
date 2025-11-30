#!/bin/bash

echo "========================================"
echo "MySQL 데이터베이스 초기화 시작"
echo "========================================"

# application.yml에 설정된 비밀번호 사용 (기본값: 1234)
MYSQL_PASSWORD="1234"

echo ""
echo "MySQL root 비밀번호: $MYSQL_PASSWORD 사용"
echo "※ 비밀번호가 다르면 backend/src/main/resources/application.yml 파일을 수정하세요"
echo ""

# 완전 초기화 (DB 생성 + 테이블 스키마 + 샘플 데이터)
echo "데이터베이스 생성, 테이블 스키마, 샘플 데이터 삽입 중..."
mysql -u root -p"$MYSQL_PASSWORD" --default-character-set=utf8mb4 < init_complete.sql

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 초기화 실패!"
    echo "MySQL 비밀번호가 다르다면 backend/src/main/resources/application.yml 파일을 확인하세요"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ 모든 작업 완료!"
echo "========================================"
