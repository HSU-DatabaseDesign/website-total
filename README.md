# WebNovelReviewSite

웹소설 리뷰 사이트 프로젝트입니다.

## 기술 스택

- **Backend**: Spring Boot, Gradle, Java
- **Frontend**: React, Vite
- **Database**: MySQL

## 시작하기

### 사전 요구사항

- Java 17+
- Node.js 18+
- MySQL 8.0+
- **Windows**: Git Bash 사용 권장
- **Mac/Linux**: 기본 터미널 사용

### MySQL 설정

#### 1. MySQL 사용자 및 비밀번호 설정

프로젝트는 기본적으로 다음 MySQL 계정을 사용합니다:
- **사용자명**: `root`
- **비밀번호**: `test1234`

**사용자명 또는 비밀번호가 다른 경우:**
`backend/src/main/resources/application.yml` 파일을 열어서 수정하세요:

```yaml
spring:
  datasource:
    username: root  # 본인의 MySQL 사용자명으로 변경
    password: test1234  # 본인의 MySQL 비밀번호로 변경
```

#### 2. MySQL 클라이언트 설치 (터미널에서 setup_db.sh 사용 시)

**Windows:**
```bash
# MySQL 설치 후 환경변수에 MySQL bin 폴더 추가
# 예: C:\Program Files\MySQL\MySQL Server 8.0\bin
```

**Mac:**
```bash
brew install mysql
```

#### 3. MySQL Workbench로 DB 초기화 (대안)

터미널 대신 MySQL Workbench를 사용해도 됩니다:

1. MySQL Workbench 실행
2. 로컬 MySQL 서버에 연결
3. `File > Open SQL Script` → `init_complete.sql` 선택
4. ⚡ 번개 아이콘 클릭하여 실행

> **참고**: `novelSite` 데이터베이스가 없어도 됩니다. 스크립트가 자동으로 생성합니다.

### 설치 및 실행

#### 🆕 처음 clone한 경우 (전체 초기 설정)

```bash
# 1. 저장소 클론
git clone <repository-url>
cd <project-folder>

# 2. MySQL 사용자명/비밀번호 확인 및 설정
# 본인의 MySQL 계정이 root/test1234가 아니라면
# backend/src/main/resources/application.yml 파일에서 username, password 수정

# 3. 초기 설정 스크립트 실행 (최초 1회만)
chmod +x setup.sh
./setup.sh
# → DB 초기화 물어보면 'y' 입력

# 4. 서버 실행
./start_all.sh
```

#### 🔄 DB만 초기화하는 경우

```bash
./setup_db.sh
```

#### ▶️ 이미 설정 완료 (바로 서버 실행)

```bash
# 백엔드 + 프론트엔드 동시 실행
./start_all.sh
```

### 스크립트 명령어 정리

| 명령어 | 용도 | 설명 |
|--------|------|------|
| `./setup.sh` | 🆕 처음 clone | 실행 권한, 의존성 설치, DB 초기화 (최초 1회) |
| `./setup_db.sh` | 🔄 DB 초기화 | 데이터베이스만 초기화 (샘플 데이터 포함) |
| `./start_all.sh` | ▶️ 서버 실행 | 백엔드 + 프론트엔드 동시 실행 |
| `./start_backend.sh` | 백엔드만 | Spring Boot 서버만 실행 |
| `./start_frontend.sh` | 프론트엔드만 | React 개발 서버만 실행 |

### 접속 주소

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 프로젝트 구조

```
├── backend/          # Spring Boot 백엔드
│   └── src/main/resources/
│       └── application.yml  # DB 설정 파일
├── frontend/         # React 프론트엔드
│   └── dbMiniProject/
│       └── src/assets/
│           ├── novel_1.png ~ novel_20.png  # 소설 표지 이미지
│           └── index.js  # 이미지 export 파일
├── init_complete.sql # DB 초기화 스크립트
├── setup.sh          # 초기 설정 스크립트
├── setup_db.sh       # DB 설정 스크립트
├── start_all.sh      # 전체 서버 실행
├── start_backend.sh  # 백엔드 실행
└── start_frontend.sh # 프론트엔드 실행
```

## 데이터베이스 구조

### 초기 데이터 (init_complete.sql)

프로젝트는 다음과 같은 샘플 데이터를 포함합니다:

- **사용자**: 16명 (일반 유저 10명, 작가 5명, 관리자 1명)
- **웹소설**: 20개 (장르별 분류)
- **리뷰**: 40개 이상
- **컬렉션**: 22개
- **배지**: 12개 (출석, 팔로워, 리뷰, 컬렉션)

### 테스트 계정

#### 배지 획득 테스트용 계정 (user1)

**로그인 정보:**
- ID: `user1`
- 비밀번호: `pass1234`

**현재 상태:**
- 리뷰: 9개 작성 (1개 더 작성 시 "리뷰 중급" 배지 획득)
- 컬렉션: 9개 생성 (1개 더 생성 시 "컬렉션 중급" 배지 획득)
- 출석: 10일 (출석 입문, 출석 중급 배지 보유)

> **배지 테스트**: user1 계정으로 로그인하여 리뷰 1개 또는 컬렉션 1개를 추가하면 배지 획득 기능을 테스트할 수 있습니다.

#### 기타 테스트 계정

| ID | 비밀번호 | 역할 | 특징 |
|----|---------|------|------|
| `admin1` | `admin1234` | 관리자 | 모든 권한 보유 |
| `author1` | `pass1234` | 작가 | 팔로워 10명 이상, 출석 30일 |
| `user2` ~ `user10` | `pass1234` | 일반 유저 | 다양한 활동 데이터 |

### 소설 목록 (ID 순서)

| ID | 소설명 | 작가 | 장르 | 이미지 파일 |
|----|--------|------|------|-------------|
| 1 | 눈물을 마시는 새 | 이영도 | FANTASY | novel_1.png |
| 2 | 전지적 독자 시점 | 싱숑 | FANTASY | novel_2.png |
| 3 | 나 혼자만 레벨업 | 추공 | ACTION | novel_3.png |
| 4 | 달빛 조각사 | 남희성 | GAME | novel_4.png |
| 5 | 화산귀환 | 비가 | MARTIAL_ARTS | novel_5.png |
| 6 | 무한의 마법사 | 김치만두 | FANTASY | novel_6.png |
| 7 | 오버기어드 | 작가J | GAME | novel_7.png |
| 8 | 나노마신 | 한중월야 | MARTIAL_ARTS | novel_8.png |
| 9 | 재벌집 막내아들 | 작가N | ROMANCE | novel_9.png |
| 10 | 로맨스는 별책부록 | 작가A | ROMANCE | novel_10.png |
| 11 | 김부장 | 박지리 | MODERN | novel_11.png |
| 12 | 스릴러 게임 | 작가C | THRILLER | novel_12.png |
| 13 | 헌터의 귀환 | 작가H | ACTION | novel_13.png |
| 14 | 마법사의 탑 | 작가E | FANTASY | novel_14.png |
| 15 | 천마신교 | 작가L | MARTIAL_ARTS | novel_15.png |
| 16 | 검신 | 작가M | MARTIAL_ARTS | novel_16.png |
| 17 | 달콤한 복수 | 작가O | ROMANCE | novel_17.png |
| 18 | 의사 요한 | 작가Q | MODERN | novel_18.png |
| 19 | 살인자의 기억 | 작가T | THRILLER | novel_19.png |
| 20 | 용의 후예 | 작가F | FANTASY | novel_20.png |

## 소설 데이터 수정 가이드

### 소설 추가하는 경우

1. **SQL 파일 수정** (`init_complete.sql`)
   ```sql
   INSERT INTO novel (novel_name, novel_author, ...) VALUES
   ('새로운 소설', '작가명', ...);
   ```

2. **이미지 추가** (`frontend/dbMiniProject/src/assets/`)
   - 파일명: `novel_21.png` (다음 ID 번호)
   - 권장 크기: 300x400px 정도
   - 포맷: `.png`, `.jpg`, `.webp` 가능

3. **이미지 export 추가** (`frontend/dbMiniProject/src/assets/index.js`)
   ```javascript
   import Novel21 from '@/assets/novel_21.png';
   export { ..., Novel21 };
   ```

4. **페이지에서 이미지 매핑 추가**
   - `frontend/dbMiniProject/src/pages/detailNovel/DetailNovel.jsx`
   - `frontend/dbMiniProject/src/pages/homePage/HomePage.jsx`
   
   `getNovelImage` 함수에 추가:
   ```javascript
   const novelImages = {
     ...,
     21: Novel21,
   };
   ```

> **중요**: SQL의 INSERT 순서대로 ID가 부여되므로, 이미지 파일명(`novel_X.png`)의 번호와 SQL INSERT 순서를 일치시켜야 합니다.
