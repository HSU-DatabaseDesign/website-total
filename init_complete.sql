-- ========================================
-- 웹소설 리뷰 사이트 완전 초기화 스크립트
-- 유저 10명, 작가 5명, 어드민 1명
-- ========================================

-- 데이터베이스 생성
DROP DATABASE IF EXISTS novelSite;
CREATE DATABASE novelSite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE novelSite;

-- ========================================
-- 테이블 스키마 생성
-- ========================================

-- 1. users 테이블
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    id VARCHAR(20),
    passwd VARCHAR(20),
    nickname VARCHAR(20),
    email VARCHAR(254),
    role VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. author_info 테이블
CREATE TABLE author_info (
    user_id BIGINT PRIMARY KEY,
    pen_name VARCHAR(20),
    nationality VARCHAR(20),
    debut_year VARCHAR(4),
    brief VARCHAR(255),
    profile_image VARCHAR(255),
    is_confirmed BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. novel 테이블
CREATE TABLE novel (
    novel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    novel_name VARCHAR(255),
    novel_author VARCHAR(20),
    novel_context TEXT,
    genre VARCHAR(50),
    restricted VARCHAR(50),
    novel_status VARCHAR(50),
    platform VARCHAR(50),
    registration_date DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. collection 테이블
CREATE TABLE collection (
    collection_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    collection_name VARCHAR(255),
    content VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5. collected_novel 테이블 (컬렉션-소설 중간 테이블)
CREATE TABLE collected_novel (
    collection_id BIGINT,
    novel_id BIGINT,
    PRIMARY KEY (collection_id, novel_id),
    FOREIGN KEY (collection_id) REFERENCES collection(collection_id) ON DELETE CASCADE,
    FOREIGN KEY (novel_id) REFERENCES novel(novel_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5-1. saved_collection 테이블 (컬렉션 저장/북마크)
CREATE TABLE saved_collection (
    user_id BIGINT,
    collection_id BIGINT,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, collection_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collection(collection_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. review 테이블
CREATE TABLE review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    novel_id BIGINT,
    content VARCHAR(255),
    star DECIMAL(2,1),
    views BIGINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (novel_id) REFERENCES novel(novel_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. hashtag 테이블
CREATE TABLE hashtag (
    hashtag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hashtag_name VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. review_hashtag 테이블 (리뷰-해시태그 다대다 관계)
CREATE TABLE review_hashtag (
    review_id BIGINT,
    hashtag_id BIGINT,
    PRIMARY KEY (review_id, hashtag_id),
    FOREIGN KEY (review_id) REFERENCES review(review_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtag(hashtag_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. novel_hashtag 테이블 (소설-해시태그 다대다 관계)
CREATE TABLE novel_hashtag (
    novel_id BIGINT,
    hashtag_id BIGINT,
    PRIMARY KEY (novel_id, hashtag_id),
    FOREIGN KEY (novel_id) REFERENCES novel(novel_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtag(hashtag_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. review_like 테이블 (리뷰 좋아요)
CREATE TABLE review_like (
    review_id BIGINT,
    user_id BIGINT,
    PRIMARY KEY (review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES review(review_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. follow 테이블
CREATE TABLE follow (
    follower_id BIGINT,
    target_id BIGINT,
    PRIMARY KEY (follower_id, target_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. badge 테이블
CREATE TABLE badge (
    badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    badge_name VARCHAR(20),
    badge_image VARCHAR(255),
    badge_type VARCHAR(50),
    badge_mission VARCHAR(30),
    condition_value INT,
    start_date DATETIME,
    end_date DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. user_badge 테이블 (사용자-배지 중간 테이블)
CREATE TABLE user_badge (
    user_id BIGINT,
    badge_id BIGINT,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badge(badge_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. login_history 테이블 (출석 기록)
CREATE TABLE login_history (
    login_history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_date DATE NOT NULL,
    UNIQUE KEY uk_user_login_date (user_id, login_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 샘플 데이터 삽입
-- ========================================

-- 1. 사용자 생성 (유저 10명 + 작가 5명 + 어드민 1명 = 16명)
INSERT INTO users (name, id, passwd, nickname, email, role) VALUES
-- 어드민 계정
('관리자', 'admin1', 'admin1234', '사이트관리자', 'admin@novelnet.com', 'ADMIN'),
-- 일반 사용자 계정 (10명)
('홍길동', 'user1', 'pass1234', '독서왕', 'user1@example.com', 'USER'),
('김철수', 'user2', 'pass1234', '리뷰어', 'user2@example.com', 'USER'),
('이영희', 'user3', 'pass1234', '소설러버', 'user3@example.com', 'USER'),
('박지민', 'user4', 'pass1234', '판타지매니아', 'user4@example.com', 'USER'),
('최수진', 'user5', 'pass1234', '로맨스덕후', 'user5@example.com', 'USER'),
('정민호', 'user6', 'pass1234', '무협마스터', 'user6@example.com', 'USER'),
('강서연', 'user7', 'pass1234', '책벌레', 'user7@example.com', 'USER'),
('윤태현', 'user8', 'pass1234', '소설탐험가', 'user8@example.com', 'USER'),
('임하늘', 'user9', 'pass1234', '독서광', 'user9@example.com', 'USER'),
('송미래', 'user10', 'pass1234', '이야기수집가', 'user10@example.com', 'USER'),
-- 작가 계정 (5명)
('박민수', 'author1', 'pass1234', '이영도', 'author1@example.com', 'AUTHOR'),
('김작가', 'author2', 'pass1234', '싱숑', 'author2@example.com', 'AUTHOR'),
('이소설', 'author3', 'pass1234', '추공', 'author3@example.com', 'AUTHOR'),
('정글펜', 'author4', 'pass1234', '남희성', 'author4@example.com', 'AUTHOR'),
('한문학', 'author5', 'pass1234', '비가', 'author5@example.com', 'AUTHOR');

-- 2. 작가 정보 추가
INSERT INTO author_info (user_id, pen_name, nationality, debut_year, brief, profile_image, is_confirmed)
SELECT u.user_id, '이영도', '대한민국', '1998', '판타지 소설의 거장. 드래곤 라자, 눈물을 마시는 새 등 명작을 집필.', 'https://example.com/author1.jpg', TRUE
FROM users u WHERE u.id = 'author1'
UNION ALL
SELECT u.user_id, '싱숑', '대한민국', '2018', '전지적 독자 시점으로 웹소설계를 뒤흔든 신예 작가.', 'https://example.com/author2.jpg', TRUE
FROM users u WHERE u.id = 'author2'
UNION ALL
SELECT u.user_id, '추공', '대한민국', '2016', '나 혼자만 레벨업으로 전세계적 인기를 얻은 작가.', 'https://example.com/author3.jpg', TRUE
FROM users u WHERE u.id = 'author3'
UNION ALL
SELECT u.user_id, '남희성', '대한민국', '2007', '달빛 조각사로 게임 판타지 장르를 개척한 작가.', 'https://example.com/author4.jpg', TRUE
FROM users u WHERE u.id = 'author4'
UNION ALL
SELECT u.user_id, '비가', '대한민국', '2020', '화산귀환으로 무협 장르에 새 바람을 일으킨 작가.', 'https://example.com/author5.jpg', TRUE
FROM users u WHERE u.id = 'author5';


-- 3. 웹소설 데이터 추가 (20개)
INSERT INTO novel (novel_name, novel_author, novel_context, genre, restricted, novel_status, platform, registration_date) VALUES
('눈물을 마시는 새', '이영도', '판타지 세계관의 대서사시.', 'FANTASY', 'ALL', 'COMPLETED', 'RIDI_BOOKS', DATE_SUB(NOW(), INTERVAL 365 DAY)),
('전지적 독자 시점', '싱숑', '소설 속 세계가 현실이 되었다.', 'FANTASY', 'TEEN', 'COMPLETED', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 200 DAY)),
('나 혼자만 레벨업', '추공', '최약체 헌터에서 최강자로.', 'ACTION', 'TEEN', 'COMPLETED', 'KAKAO_PAGE', DATE_SUB(NOW(), INTERVAL 250 DAY)),
('달빛 조각사', '남희성', 'VRMMO 게임 속 모험과 성장.', 'GAME', 'ALL', 'COMPLETED', 'MUNPIA', DATE_SUB(NOW(), INTERVAL 400 DAY)),
('화산귀환', '비가', '화산파 제자의 회귀 이야기.', 'MARTIAL_ARTS', 'TEEN', 'ONGOING', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 90 DAY)),
('무한의 마법사', '김치만두', '회귀한 마법사의 복수와 성장.', 'FANTASY', 'TEEN', 'ONGOING', 'KAKAO_PAGE', DATE_SUB(NOW(), INTERVAL 150 DAY)),
('오버기어드', '작가J', '게임 속 대장장이가 최강이 되는 이야기.', 'GAME', 'TEEN', 'ONGOING', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 180 DAY)),
('나노마신', '한중월야', '나노머신을 얻은 천마의 후예.', 'MARTIAL_ARTS', 'TEEN', 'ONGOING', 'MUNPIA', DATE_SUB(NOW(), INTERVAL 110 DAY)),
('재벌집 막내아들', '작가N', '재벌가에 환생한 주인공.', 'ROMANCE', 'ALL', 'COMPLETED', 'KAKAO_PAGE', DATE_SUB(NOW(), INTERVAL 150 DAY)),
('로맨스는 별책부록', '작가A', '출판사에서 펼쳐지는 로맨스.', 'ROMANCE', 'ALL', 'COMPLETED', 'RIDI_BOOKS', DATE_SUB(NOW(), INTERVAL 200 DAY)),
('김부장', '박지리', '평범한 회사원의 일상과 성장.', 'MODERN', 'ALL', 'COMPLETED', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 180 DAY)),
('스릴러 게임', '작가C', '생존 게임에 참가한 주인공.', 'THRILLER', 'ADULT', 'ONGOING', 'KAKAO_PAGE', DATE_SUB(NOW(), INTERVAL 65 DAY)),
('헌터의 귀환', '작가H', '은퇴한 S급 헌터가 다시 돌아온다.', 'ACTION', 'TEEN', 'ONGOING', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 70 DAY)),
('마법사의 탑', '작가E', '마법사 길드에서 성장하는 주인공.', 'FANTASY', 'ALL', 'ONGOING', 'JOARA', DATE_SUB(NOW(), INTERVAL 80 DAY)),
('천마신교', '작가L', '마교의 젊은 교주가 무림을 평정.', 'MARTIAL_ARTS', 'TEEN', 'ONGOING', 'MUNPIA', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('검신', '작가M', '검의 경지에 오른 무인의 이야기.', 'MARTIAL_ARTS', 'ADULT', 'COMPLETED', 'JOARA', DATE_SUB(NOW(), INTERVAL 500 DAY)),
('달콤한 복수', '작가O', '전 남친에게 복수하려다 사랑에 빠지는 이야기.', 'ROMANCE', 'TEEN', 'ONGOING', 'RIDI_BOOKS', DATE_SUB(NOW(), INTERVAL 30 DAY)),
('의사 요한', '작가Q', '천재 의사의 병원 이야기.', 'MODERN', 'ALL', 'COMPLETED', 'KAKAO_PAGE', DATE_SUB(NOW(), INTERVAL 220 DAY)),
('살인자의 기억', '작가T', '기억을 잃은 살인자의 진실 추적.', 'THRILLER', 'ADULT', 'COMPLETED', 'RIDI_BOOKS', DATE_SUB(NOW(), INTERVAL 280 DAY)),
('용의 후예', '작가F', '드래곤의 피를 이어받은 소년의 모험.', 'FANTASY', 'TEEN', 'ONGOING', 'NAVER_SERIES', DATE_SUB(NOW(), INTERVAL 60 DAY));


-- 4. 컬렉션 생성 (다양한 유저/작가가 생성)
INSERT INTO collection (collection_name, content, user_id, created_at) VALUES
-- user1: 컬렉션 9개 (1개 더 만들면 컬렉션 중급 달성)
('내가 좋아하는 판타지', '판타지 장르 최고의 작품들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 100 DAY)),
('완독한 작품들', '끝까지 읽은 작품들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 90 DAY)),
('추천 작품 모음', '친구들에게 추천하고 싶은 작품들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 80 DAY)),
('무협 명작', '무협 장르 명작들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 70 DAY)),
('액션 베스트', '액션 장르 베스트.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 60 DAY)),
('힐링 소설', '마음이 따뜻해지는 작품들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 50 DAY)),
('스릴러 모음', '긴장감 넘치는 스릴러들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 45 DAY)),
('로맨스 추천', '달달한 로맨스 작품들.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 40 DAY)),
('게임 판타지', '게임 세계관 소설 모음.', (SELECT user_id FROM users WHERE id = 'user1'), DATE_SUB(NOW(), INTERVAL 35 DAY)),
-- user2: 컬렉션 3개
('읽고 싶은 작품', '나중에 읽을 작품 리스트.', (SELECT user_id FROM users WHERE id = 'user2'), DATE_SUB(NOW(), INTERVAL 85 DAY)),
('게임 판타지 모음', '게임 세계관 소설들.', (SELECT user_id FROM users WHERE id = 'user2'), DATE_SUB(NOW(), INTERVAL 75 DAY)),
('스릴러 추천작', '손에 땀을 쥐게 하는 스릴러들.', (SELECT user_id FROM users WHERE id = 'user2'), DATE_SUB(NOW(), INTERVAL 65 DAY)),
-- user3: 컬렉션 2개
('로맨스 베스트', '설레는 로맨스 작품 모음.', (SELECT user_id FROM users WHERE id = 'user3'), DATE_SUB(NOW(), INTERVAL 55 DAY)),
('완결작 모음', '완결된 작품들만.', (SELECT user_id FROM users WHERE id = 'user3'), DATE_SUB(NOW(), INTERVAL 45 DAY)),
-- user4: 컬렉션 1개
('신작 알림', '최근 연재 시작한 작품들.', (SELECT user_id FROM users WHERE id = 'user4'), DATE_SUB(NOW(), INTERVAL 35 DAY)),
-- user5: 컬렉션 4개
('로맨스 입문작', '로맨스 장르 입문자를 위한 작품들.', (SELECT user_id FROM users WHERE id = 'user5'), DATE_SUB(NOW(), INTERVAL 40 DAY)),
('달달한 로맨스', '달달한 로맨스만 모음.', (SELECT user_id FROM users WHERE id = 'user5'), DATE_SUB(NOW(), INTERVAL 30 DAY)),
('오피스 로맨스', '직장 배경 로맨스.', (SELECT user_id FROM users WHERE id = 'user5'), DATE_SUB(NOW(), INTERVAL 20 DAY)),
('연예계 로맨스', '연예계 배경 로맨스.', (SELECT user_id FROM users WHERE id = 'user5'), DATE_SUB(NOW(), INTERVAL 10 DAY)),
-- author1: 컬렉션 2개
('작가 추천작', '작가가 직접 추천하는 작품들.', (SELECT user_id FROM users WHERE id = 'author1'), DATE_SUB(NOW(), INTERVAL 25 DAY)),
('판타지 입문작', '판타지 장르 입문자를 위한 작품들.', (SELECT user_id FROM users WHERE id = 'author1'), DATE_SUB(NOW(), INTERVAL 15 DAY)),
-- author2: 컬렉션 1개
('동료 작가 작품', '동료 작가들의 작품 모음.', (SELECT user_id FROM users WHERE id = 'author2'), DATE_SUB(NOW(), INTERVAL 12 DAY)),
-- admin1: 컬렉션 1개
('올해의 베스트', '2024년 최고의 작품들.', (SELECT user_id FROM users WHERE id = 'admin1'), DATE_SUB(NOW(), INTERVAL 5 DAY));


-- 5. 컬렉션에 소설 추가
INSERT INTO collected_novel (collection_id, novel_id)
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '내가 좋아하는 판타지' AND n.novel_name IN ('눈물을 마시는 새', '전지적 독자 시점', '무한의 마법사', '용의 후예')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '완독한 작품들' AND n.novel_name IN ('눈물을 마시는 새', '김부장', '달빛 조각사', '검신')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '추천 작품 모음' AND n.novel_name IN ('눈물을 마시는 새', '전지적 독자 시점', '나 혼자만 레벨업')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '무협 명작' AND n.novel_name IN ('화산귀환', '나노마신', '천마신교', '검신')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '게임 판타지 모음' AND n.novel_name IN ('달빛 조각사', '오버기어드')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '로맨스 베스트' AND n.novel_name IN ('로맨스는 별책부록', '재벌집 막내아들', '달콤한 복수')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '스릴러 추천작' AND n.novel_name IN ('스릴러 게임', '살인자의 기억')
UNION ALL
SELECT c.collection_id, n.novel_id FROM collection c, novel n
WHERE c.collection_name = '올해의 베스트' AND n.novel_name IN ('전지적 독자 시점', '나 혼자만 레벨업', '화산귀환', '재벌집 막내아들');

-- 6. 팔로우 관계 추가 (다양한 팔로우 수)
INSERT INTO follow (follower_id, target_id)
-- user1: 6명 팔로우 (팔로워 입문 달성)
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user1' AND u2.id IN ('user2', 'user3', 'user4', 'author1', 'author2', 'author3')
UNION ALL
-- user2: 4명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user2' AND u2.id IN ('user1', 'user3', 'author1', 'author2')
UNION ALL
-- user3: 3명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user3' AND u2.id IN ('user1', 'author1', 'author5')
UNION ALL
-- user4: 2명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user4' AND u2.id IN ('author1', 'author3')
UNION ALL
-- user5: 5명 팔로우 (팔로워 입문 달성)
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user5' AND u2.id IN ('user1', 'user2', 'user3', 'author1', 'author2')
UNION ALL
-- user6: 8명 팔로우 (팔로워 입문 달성)
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user6' AND u2.id IN ('user1', 'user2', 'user3', 'user4', 'user5', 'author1', 'author4', 'author5')
UNION ALL
-- user7: 1명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user7' AND u2.id IN ('author1')
UNION ALL
-- user8: 3명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user8' AND u2.id IN ('user1', 'user6', 'author2')
UNION ALL
-- user9: 2명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user9' AND u2.id IN ('author3', 'author4')
UNION ALL
-- user10: 4명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'user10' AND u2.id IN ('user1', 'user5', 'author1', 'author5')
UNION ALL
-- author1: 4명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'author1' AND u2.id IN ('author2', 'author3', 'author4', 'author5')
UNION ALL
-- author2: 3명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'author2' AND u2.id IN ('author1', 'author3', 'user1')
UNION ALL
-- author3: 2명 팔로우
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'author3' AND u2.id IN ('author1', 'author4')
UNION ALL
-- author4: 5명 팔로우 (팔로워 입문 달성)
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'author4' AND u2.id IN ('author1', 'author2', 'author5', 'user1', 'user6')
UNION ALL
-- author5: 6명 팔로우 (팔로워 입문 달성)
SELECT u1.user_id, u2.user_id FROM users u1, users u2 WHERE u1.id = 'author5' AND u2.id IN ('author1', 'author2', 'author3', 'author4', 'user1', 'user5');


-- 7. 리뷰 데이터 추가 (다양한 리뷰 수)
INSERT INTO review (user_id, novel_id, content, star, views) VALUES
-- user1: 리뷰 9개 (1개 더 만들면 리뷰 중급 달성)
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '눈물을 마시는 새'), '판타지 소설의 정석! 세계관이 정말 탄탄합니다.', 5.0, 350),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '전지적 독자 시점'), '몰입감이 장난 아닙니다. 강추!', 5.0, 420),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '나 혼자만 레벨업'), '성장물의 교과서.', 4.5, 280),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '달빛 조각사'), '게임 소설의 원조.', 4.0, 150),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '화산귀환'), '무협 회귀물의 정석!', 4.5, 230),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '검신'), '검술 묘사가 일품.', 4.5, 165),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '무한의 마법사'), '마법 시스템이 독특해요.', 4.5, 180),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '오버기어드'), '대장장이 주인공 신선해요.', 4.0, 140),
((SELECT user_id FROM users WHERE id = 'user1'), (SELECT novel_id FROM novel WHERE novel_name = '나노마신'), '무협과 SF의 조합이 좋아요.', 4.5, 155),
-- user2: 리뷰 4개
((SELECT user_id FROM users WHERE id = 'user2'), (SELECT novel_id FROM novel WHERE novel_name = '눈물을 마시는 새'), '이영도 작가님의 대표작!', 5.0, 220),
((SELECT user_id FROM users WHERE id = 'user2'), (SELECT novel_id FROM novel WHERE novel_name = '나 혼자만 레벨업'), '성장형 주인공 좋아하시면 강추.', 4.5, 195),
((SELECT user_id FROM users WHERE id = 'user2'), (SELECT novel_id FROM novel WHERE novel_name = '오버기어드'), '대장장이 주인공이 신선해요.', 4.0, 145),
((SELECT user_id FROM users WHERE id = 'user2'), (SELECT novel_id FROM novel WHERE novel_name = '스릴러 게임'), '긴장감 넘치는 전개.', 4.5, 175),
-- user3: 리뷰 3개
((SELECT user_id FROM users WHERE id = 'user3'), (SELECT novel_id FROM novel WHERE novel_name = '로맨스는 별책부록'), '달달한 로맨스. 힐링됩니다.', 4.0, 120),
((SELECT user_id FROM users WHERE id = 'user3'), (SELECT novel_id FROM novel WHERE novel_name = '재벌집 막내아들'), '사이다 전개가 시원해요!', 4.5, 280),
((SELECT user_id FROM users WHERE id = 'user3'), (SELECT novel_id FROM novel WHERE novel_name = '달콤한 복수'), '로맨스와 복수의 조합이 좋아요.', 4.0, 130),
-- user4: 리뷰 2개
((SELECT user_id FROM users WHERE id = 'user4'), (SELECT novel_id FROM novel WHERE novel_name = '무한의 마법사'), '마법 시스템이 잘 짜여있어요.', 4.5, 160),
((SELECT user_id FROM users WHERE id = 'user4'), (SELECT novel_id FROM novel WHERE novel_name = '용의 후예'), '드래곤 설정이 멋있어요.', 4.0, 110),
-- user5: 리뷰 5개 (리뷰 입문 달성)
((SELECT user_id FROM users WHERE id = 'user5'), (SELECT novel_id FROM novel WHERE novel_name = '로맨스는 별책부록'), '출판사 배경이 신선해요.', 4.0, 95),
((SELECT user_id FROM users WHERE id = 'user5'), (SELECT novel_id FROM novel WHERE novel_name = '재벌집 막내아들'), '재벌 로맨스의 정석!', 4.5, 180),
((SELECT user_id FROM users WHERE id = 'user5'), (SELECT novel_id FROM novel WHERE novel_name = '달콤한 복수'), '복수극인데 달달해요.', 4.0, 115),
((SELECT user_id FROM users WHERE id = 'user5'), (SELECT novel_id FROM novel WHERE novel_name = '의사 요한'), '의료 드라마 좋아하시면 추천!', 4.0, 120),
((SELECT user_id FROM users WHERE id = 'user5'), (SELECT novel_id FROM novel WHERE novel_name = '김부장'), '일상물 좋아하시면 추천드려요.', 4.0, 95),
-- user6: 리뷰 7개 (리뷰 입문 달성)
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '화산귀환'), '무협 회귀물의 새로운 기준!', 5.0, 310),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '나노마신'), '무협 + SF 조합이 독특해요.', 4.0, 135),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '천마신교'), '마교 주인공이 신선해요.', 4.0, 125),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '검신'), '검술 묘사가 일품입니다.', 4.5, 165),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '눈물을 마시는 새'), '판타지 입문작으로 최고.', 5.0, 210),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '전지적 독자 시점'), '결말을 알고 있다는 설정이 신선.', 4.5, 188),
((SELECT user_id FROM users WHERE id = 'user6'), (SELECT novel_id FROM novel WHERE novel_name = '나 혼자만 레벨업'), '헌터물의 교과서.', 4.5, 200),
-- user7: 리뷰 1개
((SELECT user_id FROM users WHERE id = 'user7'), (SELECT novel_id FROM novel WHERE novel_name = '달빛 조각사'), '게임 소설의 클래식.', 4.0, 170),
-- user8: 리뷰 2개
((SELECT user_id FROM users WHERE id = 'user8'), (SELECT novel_id FROM novel WHERE novel_name = '살인자의 기억'), '반전이 충격적이에요.', 4.5, 190),
((SELECT user_id FROM users WHERE id = 'user8'), (SELECT novel_id FROM novel WHERE novel_name = '스릴러 게임'), '밤새 읽었어요.', 4.5, 175),
-- user9: 리뷰 1개
((SELECT user_id FROM users WHERE id = 'user9'), (SELECT novel_id FROM novel WHERE novel_name = '헌터의 귀환'), '은퇴 헌터의 복귀가 통쾌해요.', 4.5, 155),
-- user10: 리뷰 0개
-- author1: 리뷰 2개
((SELECT user_id FROM users WHERE id = 'author1'), (SELECT novel_id FROM novel WHERE novel_name = '전지적 독자 시점'), '후배 작가의 작품인데 정말 잘 썼어요.', 5.0, 450),
((SELECT user_id FROM users WHERE id = 'author1'), (SELECT novel_id FROM novel WHERE novel_name = '화산귀환'), '무협의 새로운 바람.', 4.5, 320),
-- author2: 리뷰 1개
((SELECT user_id FROM users WHERE id = 'author2'), (SELECT novel_id FROM novel WHERE novel_name = '눈물을 마시는 새'), '제가 가장 존경하는 작가님의 작품.', 5.0, 380),
-- author3: 리뷰 1개
((SELECT user_id FROM users WHERE id = 'author3'), (SELECT novel_id FROM novel WHERE novel_name = '달빛 조각사'), '게임 판타지의 원조.', 4.5, 250),
-- author4: 리뷰 3개
((SELECT user_id FROM users WHERE id = 'author4'), (SELECT novel_id FROM novel WHERE novel_name = '눈물을 마시는 새'), '판타지의 교과서.', 5.0, 300),
((SELECT user_id FROM users WHERE id = 'author4'), (SELECT novel_id FROM novel WHERE novel_name = '나 혼자만 레벨업'), '성장물의 정석.', 4.5, 220),
((SELECT user_id FROM users WHERE id = 'author4'), (SELECT novel_id FROM novel WHERE novel_name = '화산귀환'), '무협 회귀물 최고.', 5.0, 280),
-- author5: 리뷰 2개
((SELECT user_id FROM users WHERE id = 'author5'), (SELECT novel_id FROM novel WHERE novel_name = '나노마신'), '무협과 SF의 만남.', 4.0, 145),
((SELECT user_id FROM users WHERE id = 'author5'), (SELECT novel_id FROM novel WHERE novel_name = '천마신교'), '마교 이야기가 흥미로워요.', 4.0, 130),
-- admin1: 리뷰 1개
((SELECT user_id FROM users WHERE id = 'admin1'), (SELECT novel_id FROM novel WHERE novel_name = '나 혼자만 레벨업'), '관리자 추천작입니다!', 5.0, 500);


-- 8. 해시태그 데이터 추가
INSERT INTO hashtag (hashtag_name) VALUES
('판타지'), ('무협'), ('로맨스'), ('액션'), ('스릴러'),
('게임'), ('회귀'), ('성장'), ('힐링'), ('복수'),
('재벌'), ('의료'), ('일상'), ('SF'), ('드라마'),
('명작'), ('추천'), ('베스트'), ('신작'), ('완결');

-- 9. 배지 데이터 추가 (출석, 팔로워, 리뷰, 컬렉션 각 5, 10, 30)
INSERT INTO badge (badge_name, badge_image, badge_type, badge_mission, condition_value, start_date, end_date) VALUES
-- 출석 배지 (check 이미지)
('출석 입문', '✅', 'LOGIN_DAYS', '5일 출석', 5, NOW(), NULL),
('출석 중급', '✅', 'LOGIN_DAYS', '10일 출석', 10, NOW(), NULL),
('출석 마스터', '✅', 'LOGIN_DAYS', '30일 출석', 30, NOW(), NULL),
-- 팔로워 배지 (check 이미지) - 나를 팔로우하는 사람 수
('팔로워 입문', '👋', 'FOLLOW_COUNT', '팔로워 5명 달성', 5, NOW(), NULL),
('팔로워 중급', '🤝', 'FOLLOW_COUNT', '팔로워 10명 달성', 10, NOW(), NULL),
('팔로워 마스터', '🌐', 'FOLLOW_COUNT', '팔로워 30명 달성', 30, NOW(), NULL),
-- 소설 리뷰 배지 (review 이미지)
('리뷰 입문', '📝', 'REVIEW_COUNT', '5개 리뷰 작성', 5, NOW(), NULL),
('리뷰 중급', '📝', 'REVIEW_COUNT', '10개 리뷰 작성', 10, NOW(), NULL),
('리뷰 마스터', '📝', 'REVIEW_COUNT', '30개 리뷰 작성', 30, NOW(), NULL),
-- 컬렉션 추가 배지 (read 이미지)
('컬렉션 입문', '📚', 'COLLECTION_COUNT', '5개 컬렉션 생성', 5, NOW(), NULL),
('컬렉션 중급', '📖', 'COLLECTION_COUNT', '10개 컬렉션 생성', 10, NOW(), NULL),
('컬렉션 마스터', '🎯', 'COLLECTION_COUNT', '30개 컬렉션 생성', 30, NOW(), NULL);

-- 10. 리뷰 해시태그 연결 추가
INSERT INTO review_hashtag (review_id, hashtag_id)
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%판타지 소설의 정석%' AND h.hashtag_name IN ('판타지', '명작', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%몰입감이 장난%' AND h.hashtag_name IN ('판타지', '추천', '베스트')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%성장물의 교과서%' AND h.hashtag_name IN ('성장', '액션', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%게임 소설의 원조%' AND h.hashtag_name IN ('게임', '판타지', '명작')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%무협 회귀물의 정석%' AND h.hashtag_name IN ('무협', '회귀', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%달달한 로맨스%' AND h.hashtag_name IN ('로맨스', '힐링', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%사이다 전개%' AND h.hashtag_name IN ('재벌', '로맨스', '복수')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%긴장감 넘치는%' AND h.hashtag_name IN ('스릴러', '액션', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%반전이 충격적%' AND h.hashtag_name IN ('스릴러', '드라마', '추천')
UNION ALL
SELECT r.review_id, h.hashtag_id FROM review r, hashtag h
WHERE r.content LIKE '%의료 드라마%' AND h.hashtag_name IN ('의료', '드라마', '일상');

-- 11. 소설 해시태그 연결 추가
INSERT INTO novel_hashtag (novel_id, hashtag_id)
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '눈물을 마시는 새' AND h.hashtag_name IN ('판타지', '명작', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '전지적 독자 시점' AND h.hashtag_name IN ('판타지', '베스트', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '나 혼자만 레벨업' AND h.hashtag_name IN ('액션', '성장', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '달빛 조각사' AND h.hashtag_name IN ('게임', '판타지', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '화산귀환' AND h.hashtag_name IN ('무협', '회귀', '신작')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '로맨스는 별책부록' AND h.hashtag_name IN ('로맨스', '힐링', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '재벌집 막내아들' AND h.hashtag_name IN ('재벌', '로맨스', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '스릴러 게임' AND h.hashtag_name IN ('스릴러', '액션', '신작')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '의사 요한' AND h.hashtag_name IN ('의료', '드라마', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '김부장' AND h.hashtag_name IN ('일상', '드라마', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '나노마신' AND h.hashtag_name IN ('무협', 'SF', '신작')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '천마신교' AND h.hashtag_name IN ('무협', '액션', '신작')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '검신' AND h.hashtag_name IN ('무협', '명작', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '달콤한 복수' AND h.hashtag_name IN ('로맨스', '복수', '신작')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '살인자의 기억' AND h.hashtag_name IN ('스릴러', '드라마', '완결')
UNION ALL
SELECT n.novel_id, h.hashtag_id FROM novel n, hashtag h
WHERE n.novel_name = '용의 후예' AND h.hashtag_name IN ('판타지', '성장', '신작');

-- 12. 리뷰 좋아요 추가
INSERT INTO review_like (review_id, user_id)
SELECT r.review_id, u.user_id FROM review r, users u
WHERE r.content LIKE '%판타지 소설의 정석%' AND u.id IN ('user2', 'user3', 'user4', 'user5', 'author1', 'author2')
UNION ALL
SELECT r.review_id, u.user_id FROM review r, users u
WHERE r.content LIKE '%몰입감이 장난%' AND u.id IN ('user2', 'user3', 'user4', 'user6', 'user7', 'author1', 'author2', 'admin1')
UNION ALL
SELECT r.review_id, u.user_id FROM review r, users u
WHERE r.content LIKE '%무협 회귀물의 새로운 기준%' AND u.id IN ('user1', 'user2', 'user3', 'user4', 'user7', 'user8', 'author1')
UNION ALL
SELECT r.review_id, u.user_id FROM review r, users u
WHERE r.content LIKE '%후배 작가의 작품%' AND u.id IN ('user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'author2', 'author3')
UNION ALL
SELECT r.review_id, u.user_id FROM review r, users u
WHERE r.content LIKE '%관리자 추천작%' AND u.id IN ('user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10');

-- 13. 컬렉션 저장 (북마크)
INSERT INTO saved_collection (user_id, collection_id)
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user2' AND c.collection_name = '내가 좋아하는 판타지'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user3' AND c.collection_name = '내가 좋아하는 판타지'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user4' AND c.collection_name = '내가 좋아하는 판타지'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user5' AND c.collection_name = '추천 작품 모음'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user6' AND c.collection_name = '무협 명작'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user1' AND c.collection_name = '올해의 베스트'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user2' AND c.collection_name = '올해의 베스트'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'user3' AND c.collection_name = '올해의 베스트'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'author1' AND c.collection_name = '로맨스 베스트'
UNION ALL
SELECT u.user_id, c.collection_id FROM users u, collection c
WHERE u.id = 'author2' AND c.collection_name = '게임 판타지 모음';


-- 14. 사용자 배지 부여 (조건에 맞게)
INSERT INTO user_badge (user_id, badge_id)
-- user1: 리뷰 9개 -> 리뷰 입문, 컬렉션 9개 -> 컬렉션 입문 (1개 더 만들면 중급 달성!)
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user1' AND b.badge_name = '리뷰 입문'
UNION ALL
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user1' AND b.badge_name = '컬렉션 입문'
UNION ALL
-- user5: 리뷰 5개 -> 리뷰 입문
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user5' AND b.badge_name = '리뷰 입문'
UNION ALL
-- user6: 리뷰 7개 -> 리뷰 입문
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user6' AND b.badge_name = '리뷰 입문'
UNION ALL
-- author1: 팔로워 10명 이상 -> 팔로워 입문, 팔로워 중급
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'author1' AND b.badge_name = '팔로워 입문'
UNION ALL
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'author1' AND b.badge_name = '팔로워 중급';

-- 15. 출석 기록 추가 (샘플 데이터)
-- user1: 10일 출석 -> 출석 입문, 출석 중급
INSERT INTO login_history (user_id, login_date)
SELECT u.user_id, DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM users u, (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
               UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) days
WHERE u.id = 'user1';

-- user5: 7일 출석 -> 출석 입문
INSERT INTO login_history (user_id, login_date)
SELECT u.user_id, DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM users u, (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
               UNION SELECT 5 UNION SELECT 6) days
WHERE u.id = 'user5';

-- user6: 5일 출석 -> 출석 입문
INSERT INTO login_history (user_id, login_date)
SELECT u.user_id, DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM users u, (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) days
WHERE u.id = 'user6';

-- author1: 30일 출석 -> 출석 입문, 출석 중급, 출석 마스터
INSERT INTO login_history (user_id, login_date)
SELECT u.user_id, DATE_SUB(CURDATE(), INTERVAL n DAY)
FROM users u, (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
               UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
               UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
               UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
               UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24
               UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29) days
WHERE u.id = 'author1';

-- 출석 배지 부여 추가
INSERT INTO user_badge (user_id, badge_id)
-- user1: 10일 출석 -> 출석 입문, 출석 중급
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user1' AND b.badge_name = '출석 입문'
UNION ALL
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user1' AND b.badge_name = '출석 중급'
UNION ALL
-- user5: 7일 출석 -> 출석 입문
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user5' AND b.badge_name = '출석 입문'
UNION ALL
-- user6: 5일 출석 -> 출석 입문
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'user6' AND b.badge_name = '출석 입문'
UNION ALL
-- author1: 30일 출석 -> 출석 입문, 출석 중급, 출석 마스터
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'author1' AND b.badge_name = '출석 입문'
UNION ALL
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'author1' AND b.badge_name = '출석 중급'
UNION ALL
SELECT u.user_id, b.badge_id FROM users u, badge b WHERE u.id = 'author1' AND b.badge_name = '출석 마스터';

-- ========================================
-- 데이터 확인
-- ========================================
SELECT '=== 데이터 삽입 완료 ===' AS message;
SELECT '사용자' AS 테이블, COUNT(*) AS 개수 FROM users
UNION ALL SELECT '작가정보', COUNT(*) FROM author_info
UNION ALL SELECT '소설', COUNT(*) FROM novel
UNION ALL SELECT '컬렉션', COUNT(*) FROM collection
UNION ALL SELECT '리뷰', COUNT(*) FROM review
UNION ALL SELECT '해시태그', COUNT(*) FROM hashtag
UNION ALL SELECT '리뷰해시태그', COUNT(*) FROM review_hashtag
UNION ALL SELECT '소설해시태그', COUNT(*) FROM novel_hashtag
UNION ALL SELECT '팔로우', COUNT(*) FROM follow
UNION ALL SELECT '배지', COUNT(*) FROM badge
UNION ALL SELECT '사용자배지', COUNT(*) FROM user_badge
UNION ALL SELECT '출석기록', COUNT(*) FROM login_history;
