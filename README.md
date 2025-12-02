# 📚 웹소설 리뷰 사이트

웹소설을 검색하고, 리뷰를 작성하며, 나만의 컬렉션을 만들 수 있는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **소설 검색 및 탐색**: 장르별, 플랫폼별 웹소설 검색
- **리뷰 시스템**: 별점과 함께 리뷰 작성, 좋아요 기능
- **컬렉션**: 좋아하는 소설을 모아 나만의 컬렉션 생성 및 공유
- **팔로우**: 다른 사용자와 작가 팔로우
- **배지 시스템**: 출석, 리뷰 작성, 컬렉션 생성 등으로 배지 획득
- **작가 프로필**: 작가별 작품 및 정보 확인

## 🛠️ 기술 스택

- **Backend**: Spring Boot 3.3.5, Java 17, JPA/Hibernate
- **Frontend**: React 19, Vite, React Router, Axios, SASS
- **Database**: MySQL 8.0+

---

## 🚀 빠른 시작

### 📋 사전 요구사항

다음 프로그램들이 **반드시 설치**되어 있어야 합니다:

| 프로그램 | 최소 버전 | 확인 명령어 | 설치 방법 |
|---------|----------|------------|----------|
| **Java** | 17+ | `java -version` | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) 또는 OpenJDK |
| **Node.js** | 18+ | `node -v` | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0+ | `mysql --version` | [MySQL 다운로드](https://dev.mysql.com/downloads/installer/) |
| **MySQL Workbench** | - | GUI 실행 | MySQL 설치 시 함께 설치 (권장) |
| **Git Bash** (Windows만) | - | - | [Git for Windows](https://git-scm.com/download/win) |

> **💡 중요**: MySQL Workbench는 환경변수 설정 없이도 데이터베이스를 초기화할 수 있어 **권장**합니다!

---

## ⚙️ 설치 및 실행 (처음 clone한 경우)

### 📌 전체 실행 순서 요약

```
1. git clone → 저장소 복제
2. MySQL 설치 확인 및 비밀번호 확인
3. application.yml과 setup_db.sh 비밀번호 수정 (필요시)
4. ./setup.sh 실행 → 초기 설정 + DB 초기화
5. ./start_all.sh 실행 → 서버 시작
```

---

### 1️⃣ 저장소 클론

```bash
git clone <repository-url>
cd WebNovelReviewSite
```

---

### 2️⃣ MySQL 설치 및 설정 ⚠️ 중요!

#### MySQL 설치 확인

먼저 MySQL이 설치되어 있는지 확인하세요:

```bash
mysql --version
```

**MySQL이 설치되어 있지 않다면:**

**Windows:**
1. [MySQL 공식 사이트](https://dev.mysql.com/downloads/installer/) 접속
2. MySQL Installer 다운로드 (mysql-installer-community)
3. 설치 시 **MySQL Server**와 **MySQL Workbench** 모두 선택
4. Root 비밀번호 설정 (기억해두세요!)

**Mac:**
```bash
brew install mysql
brew services start mysql
# 초기 비밀번호 설정
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

#### MySQL 사용자 및 비밀번호 확인

프로젝트는 기본적으로 다음 MySQL 계정을 사용합니다:
- **사용자명**: `root`
- **비밀번호**: `1234`
- **데이터베이스**: `novelSite` (자동 생성됨)

#### 비밀번호가 다른 경우 필수 수정 사항

**본인의 MySQL root 비밀번호가 `1234`가 아니라면, 다음 2개 파일을 반드시 수정해야 합니다:**

##### ① 백엔드 설정 파일 수정

**파일**: `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/novelSite
    username: root      # MySQL 사용자명 (기본값: root)
    password: 1234      # ← 본인의 MySQL 비밀번호로 변경
    driver-class-name: com.mysql.cj.jdbc.Driver
```

##### ② DB 초기화 스크립트 수정

**파일**: `setup_db.sh`

파일을 열어서 **3번째 줄 근처**의 비밀번호를 수정:

```bash
#!/bin/bash

echo "========================================"
echo "MySQL 데이터베이스 초기화 시작"
echo "========================================"

# application.yml에 설정된 비밀번호 사용 (기본값: 1234)
MYSQL_PASSWORD="1234"  # ← 본인의 MySQL 비밀번호로 변경
```

> **⚠️ 중요**: 두 파일의 비밀번호가 **반드시 동일**해야 합니다!

#### MySQL 서버 실행 확인

데이터베이스 초기화 전에 MySQL 서버가 실행 중인지 확인하세요:

**Windows:**
- 작업 관리자 > 서비스 탭 > MySQL80 (또는 MySQL) 확인
- 또는 `services.msc` 실행 > MySQL 서비스 확인

**Mac:**
```bash
brew services list | grep mysql
# 또는
mysql.server status
```

**Linux:**
```bash
sudo systemctl status mysql
```

#### 데이터베이스 초기화 방법

##### 방법 1: 스크립트 사용 (환경변수 설정된 경우)

MySQL 명령어가 터미널에서 작동하는 경우:

```bash
./setup_db.sh
```

##### 방법 2: MySQL Workbench 사용 (권장 - 환경변수 없어도 가능)

**MySQL 명령어를 찾을 수 없거나 (`mysql: command not found`) 환경변수 설정이 안 된 경우:**

1. **MySQL Workbench 실행**
2. **로컬 MySQL 서버에 연결**
   - Connection Name: Local instance
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: 설치 시 설정한 비밀번호
3. **연결 후 SQL 스크립트 실행**
   - 상단 메뉴: `File` > `Open SQL Script...`
   - 프로젝트 폴더의 `init_complete.sql` 파일 선택
   - 상단의 ⚡ **번개 아이콘 (Execute)** 클릭
   - 실행 완료까지 대기 (약 10~30초)
4. **완료 확인**
   - 왼쪽 SCHEMAS 패널에서 새로고침
   - `novelSite` 데이터베이스가 생성되었는지 확인
5. **백엔드 설정 파일만 수정**
   - `backend/src/main/resources/application.yml`
   - `password: 1234` 부분을 본인의 MySQL 비밀번호로 변경

> **💡 팁**: MySQL Workbench를 사용하면 환경변수 설정 없이도 데이터베이스를 초기화할 수 있습니다!

#### 데이터베이스 초기화 내용

`init_complete.sql` 스크립트는 다음 작업을 수행합니다:

1. **기존 `novelSite` 데이터베이스 삭제** (있는 경우)
2. **새로운 `novelSite` 데이터베이스 생성**
3. **12개 테이블 생성**:
   - `users` (사용자)
   - `author_info` (작가 정보)
   - `novel` (웹소설)
   - `review` (리뷰)
   - `collection` (컬렉션)
   - `collected_novel` (컬렉션-소설 연결)
   - `saved_collection` (저장한 컬렉션)
   - `follow` (팔로우 관계)
   - `badge` (배지)
   - `user_badge` (사용자-배지 연결)
   - `review_like` (리뷰 좋아요)
   - `login_history` (출석 기록)
4. **샘플 데이터 삽입**:
   - 사용자 16명 (일반 유저 10명, 작가 5명, 관리자 1명)
   - 웹소설 20개 (장르별 분류)
   - 리뷰 40개 이상
   - 컬렉션 22개
   - 배지 12개
   - 팔로우 관계, 좋아요, 출석 기록 등

> **⚠️ 주의**: `setup_db.sh`를 실행하면 기존 `novelSite` 데이터베이스가 **완전히 삭제**되고 새로 생성됩니다!

---

### 3️⃣ 초기 설정 실행 (최초 1회만)

```bash
# 실행 권한 부여
chmod +x setup.sh

# 초기 설정 스크립트 실행
./setup.sh
```

**스크립트가 하는 일:**
1. 모든 `.sh` 파일에 실행 권한 부여
2. 프론트엔드 의존성 설치 (`npm install`)
3. 데이터베이스 초기화 여부 물어봄 → **`y` 입력**

**데이터베이스 초기화 시 생성되는 샘플 데이터:**
- 사용자 16명 (일반 10명, 작가 5명, 관리자 1명)
- 웹소설 20개
- 리뷰 40개 이상
- 컬렉션 22개
- 배지 12개

> **💡 참고**: 데이터베이스 초기화를 건너뛴 경우, 나중에 `./setup_db.sh`로 실행 가능

---

### 4️⃣ 서버 실행

```bash
./start_all.sh
```

**스크립트가 하는 일:**
1. 기존 실행 중인 서버 자동 종료 (포트 8080, 5173)
2. 백엔드 서버 시작 (Spring Boot)
3. 백엔드 준비 대기 (최대 30초)
4. 프론트엔드 서버 시작 (Vite)

**접속 주소:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

**서버 종료:** 터미널에서 `Ctrl+C`

---

### 5️⃣ 다음 실행부터는

```bash
# 서버만 시작하면 됨
./start_all.sh

# DB를 초기화하고 싶은 경우
./setup_db.sh
```

---

## 📜 스크립트 명령어 정리

| 명령어 | 실행 시점 | 설명 |
|--------|----------|------|
| `./setup.sh` | **최초 1회만** | 실행 권한 부여 + npm install + DB 초기화 |
| `./start_all.sh` | **매번 서버 시작 시** | 기존 프로세스 종료 + 백엔드/프론트엔드 시작 |
| `./setup_db.sh` | **DB 재설정 필요 시** | 데이터베이스 삭제 후 재생성 (샘플 데이터 포함) |

### 실행 순서 (처음 clone한 경우)

```bash
# 1. 저장소 클론
git clone <repository-url>
cd WebNovelReviewSite

# 2. MySQL 비밀번호 확인 및 파일 수정 (필요시)
#    - backend/src/main/resources/application.yml
#    - setup_db.sh

# 3. 초기 설정 (최초 1회)
chmod +x setup.sh
./setup.sh
# → 데이터베이스 초기화? y 입력

# 4. 서버 시작
./start_all.sh
# → http://localhost:5173 접속

# 5. 서버 종료
# → Ctrl+C
```

### 다음 실행부터

```bash
# 서버 시작만 하면 됨
./start_all.sh
```

---

## 🧪 테스트 계정

### 배지 획득 테스트용 (user1)

- **ID**: `user1`
- **비밀번호**: `pass1234`
- **상태**: 리뷰 9개, 컬렉션 9개 (1개 더 작성하면 배지 획득!)

### 기타 계정

| ID | 비밀번호 | 역할 |
|----|---------|------|
| `admin1` | `admin1234` | 관리자 |
| `author1` | `pass1234` | 작가 |
| `user2` ~ `user10` | `pass1234` | 일반 유저 |

---

## 🔧 문제 해결

### ❌ MySQL 연결 실패

**증상**: `Access denied for user 'root'@'localhost'`

**해결**: 위의 "2️⃣ MySQL 비밀번호 설정" 참조

---

### ❌ 포트 충돌

**증상**: `Port 8080 is already in use`

**해결**:

**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /F /PID <PID번호>
```

**Mac/Linux:**
```bash
lsof -ti:8080 | xargs kill -9
```

---

### ❌ MySQL 클라이언트 없음 (환경변수 미설정)

**증상**: `mysql: command not found` 또는 `setup_db.sh` 실행 시 오류

**원인**: MySQL은 설치되어 있지만 환경변수(PATH)에 등록되지 않음

**해결 방법 1 (가장 쉬움)**: MySQL Workbench 사용

위의 "2️⃣ MySQL 설치 및 설정 > 방법 2: MySQL Workbench 사용" 참조

**해결 방법 2**: 환경변수에 MySQL 추가

**Windows:**
1. `Win + R` > `sysdm.cpl` 입력 > 엔터
2. `고급` 탭 > `환경 변수` 클릭
3. 시스템 변수에서 `Path` 선택 > `편집`
4. `새로 만들기` 클릭
5. MySQL 설치 경로 추가:
   - `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - 또는 `C:\Program Files\MySQL\MySQL Server 8.1\bin`
6. 확인 후 **Git Bash 재시작**
7. `mysql --version` 명령어로 확인

**Mac:**
```bash
# .zshrc 또는 .bash_profile에 추가
echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Linux:**
```bash
# 보통 자동으로 PATH에 포함됨
# 안 되는 경우:
sudo apt-get install mysql-client
```

---

### ❌ 데이터베이스 초기화 실패

**증상**: `ERROR 1045 (28000): Access denied for user 'root'@'localhost'`

**원인**: MySQL 비밀번호 불일치

**해결**:
1. `backend/src/main/resources/application.yml` 파일 열기
2. `password: 1234` 부분을 본인의 MySQL 비밀번호로 변경
3. `setup_db.sh` 파일 열기
4. `MYSQL_PASSWORD="1234"` 부분을 동일한 비밀번호로 변경
5. 두 파일의 비밀번호가 **정확히 일치**하는지 확인
6. `./setup_db.sh` 다시 실행

---

### ❌ MySQL 서버가 실행되지 않음

**증상**: `ERROR 2002 (HY000): Can't connect to local MySQL server`

**해결**:

**Windows:**
```bash
# 서비스 시작
net start MySQL80
```

**Mac:**
```bash
# Homebrew로 설치한 경우
brew services start mysql

# 또는
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
```

---

## 📂 프로젝트 구조

```
WebNovelReviewSite/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/
│   │   └── resources/
│   │       └── application.yml # ⚠️ DB 비밀번호 설정
│   └── build.gradle
│
├── frontend/                   # React 프론트엔드
│   └── dbMiniProject/
│       ├── src/
│       │   ├── pages/         # 페이지 컴포넌트
│       │   ├── apis/          # API 호출
│       │   └── assets/        # 이미지 (novel_1.png ~ novel_20.png)
│       └── package.json
│
├── init_complete.sql          # DB 초기화 스크립트
├── setup.sh                   # ⚠️ 초기 설정
├── setup_db.sh                # ⚠️ DB 설정 (비밀번호 수정 필요)
├── start_all.sh               # 서버 시작
└── README.md
```

---

## 📊 데이터베이스

### 주요 테이블

- `users` - 사용자 정보
- `author_info` - 작가 정보
- `novel` - 웹소설 (20개)
- `review` - 리뷰
- `collection` - 컬렉션
- `follow` - 팔로우 관계
- `badge` - 배지
- `login_history` - 출석 기록

### 소설 목록 (일부)

| ID | 소설명 | 작가 | 장르 |
|----|--------|------|------|
| 1 | 눈물을 마시는 새 | 이영도 | FANTASY |
| 2 | 전지적 독자 시점 | 싱숑 | FANTASY |
| 3 | 나 혼자만 레벨업 | 추공 | ACTION |
| 4 | 달빛 조각사 | 남희성 | GAME |
| 5 | 화산귀환 | 비가 | MARTIAL_ARTS |
| ... | ... | ... | ... |

---

## 🎨 소설 추가 가이드

### 1. SQL 수정 (`init_complete.sql`)
```sql
INSERT INTO novel (novel_name, novel_author, ...) VALUES
('새로운 소설', '작가명', ...);
```

### 2. 이미지 추가
- 위치: `frontend/dbMiniProject/src/assets/`
- 파일명: `novel_21.png`
- 크기: 300x400px 권장

### 3. 이미지 export (`frontend/dbMiniProject/src/assets/index.js`)
```javascript
import Novel21 from '@/assets/novel_21.png';
export { ..., Novel21 };
```

### 4. 이미지 매핑 추가
각 페이지의 `getNovelImage` 함수에 추가:
```javascript
const novelImages = {
  // ...
  21: Novel21,
};
```

---

## 📝 개발 참고

### API 엔드포인트

- `GET /novels` - 모든 소설 조회
- `GET /novels/{id}` - 특정 소설 조회
- `GET /reviews/novel/{novelId}` - 소설의 리뷰 조회
- `POST /reviews` - 리뷰 작성
- `GET /collections` - 컬렉션 조회
- `POST /collections` - 컬렉션 생성

Swagger UI: http://localhost:8080/swagger-ui.html

---