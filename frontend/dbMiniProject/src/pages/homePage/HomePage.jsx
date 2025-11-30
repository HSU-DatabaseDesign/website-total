import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.scss'
import { Novel1, Novel2, Novel3, Novel4, Novel5, Novel6, Novel7, Novel8, Novel9, Novel10, Novel11, Novel12, Novel13, Novel14, Novel15, Novel16, Novel17, Novel18, Novel19, Novel20, Empty } from '../../assets'
import { Header } from '../../components/Header'
import { Title } from './components/Title'
import { GenreList } from './components/GenreList'
import { Card } from './components/Card'
import { readNovelApi, searchGenreNovelApi } from '../../apis/novels/novel'

// 백엔드 Genre enum에 맞춘 장르 목록 (titleList와 연동)
export const genreList = [
  { label: "전체", value: "ALL", title: "TOP 30", content: "소설넷의 웹소설 중 가장 인기있는 웹소설이에요!\n여기에 있는 작품들을 먼저 읽어보시겠어요?" },
  { label: "액션", value: "ACTION", title: "액션 소설", content: "박진감 넘치는 액션 소설들을 만나보세요!\n손에 땀을 쥐게 하는 전투와 모험이 기다립니다." },
  { label: "로맨스", value: "ROMANCE", title: "로맨스 소설", content: "설레는 로맨스 소설들을 만나보세요!\n달콤한 사랑 이야기가 기다립니다." },
  { label: "판타지", value: "FANTASY", title: "판타지 소설", content: "환상적인 판타지 세계로 떠나보세요!\n마법과 모험이 가득한 이야기들입니다." },
  { label: "드라마", value: "DRAMA", title: "드라마 소설", content: "감동적인 드라마 소설들을 만나보세요!\n인생의 희로애락을 담은 이야기들입니다." },
  { label: "스릴러", value: "THRILLER", title: "스릴러 소설", content: "긴장감 넘치는 스릴러 소설들을 만나보세요!\n반전과 서스펜스가 기다립니다." },
  { label: "게임", value: "GAME", title: "게임 소설", content: "게임 세계를 배경으로 한 소설들입니다!\nVRMMO와 게임 판타지를 즐겨보세요." },
  { label: "무협", value: "MARTIAL_ARTS", title: "무협 소설", content: "강호의 영웅들을 만나보세요!\n무림의 전설이 펼쳐집니다." },
  { label: "현대", value: "MODERN", title: "현대 소설", content: "현대를 배경으로 한 소설들입니다!\n일상 속 특별한 이야기를 만나보세요." }
];

// 장르별 기본 이미지 (색상으로 구분)
const genreColors = {
  "ACTION": "🔥",
  "ROMANCE": "💕",
  "FANTASY": "✨",
  "DRAMA": "🎭",
  "THRILLER": "🔪",
  "GAME": "🎮",
  "MARTIAL_ARTS": "⚔️",
  "MODERN": "🏙️"
};
export const initialCardData = [
  {
    id: 1,
    img : Empty,
    genre : "FANTASY",
    title : "눈물을 마시는 새",
    author : "이영도",
    stars : 4.5,
    reviews : 100,
    status : "완결작",
  },  
  {
    id: 2,
    img : Empty,
    genre : "FANTASY",
    title : "피를 마시는 새",
    author : "이영도",
    stars : 4.5,
    reviews : 111,
    status : "완결작",
  },
]

export const HomePage = () => {
  const navigate = useNavigate()
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(0); // 선택된 장르 인덱스
  const [selectedStatus, setSelectedStatus] = useState("전체");
  
  const handleCardClick = (id) => {
    navigate(`/detail/${id}`)
  }
  
  // 장르 변경 핸들러
  const handleGenreChange = async (index) => {
    setSelectedGenreIndex(index);
    setLoading(true);
    
    const genreValue = genreList[index].value;
    
    if (genreValue === "ALL") {
      // 전체 목록 조회
      const result = await readNovelApi();
      if (result.ok && result.data) {
        const transformedData = transformNovelData(result.data);
        setCardList(transformedData);
      } else {
        setCardList(initialCardData);
      }
    } else {
      // 장르별 조회
      const result = await searchGenreNovelApi(genreValue);
      if (result.ok && result.data) {
        const transformedData = transformNovelData(result.data);
        setCardList(transformedData);
      } else {
        setCardList([]);
      }
    }
    
    setLoading(false);
  };
  
  // 상태 변경 핸들러 (미완결작/완결작)
  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    setLoading(true);
    
    const genreValue = genreList[selectedGenreIndex].value;
    
    // 현재 장르에 맞는 데이터 가져오기
    let result;
    if (genreValue === "ALL") {
      result = await readNovelApi();
    } else {
      result = await searchGenreNovelApi(genreValue);
    }
    
    if (result.ok && result.data) {
      let transformedData = transformNovelData(result.data);
      
      // 상태별 필터링
      if (status === "완결작") {
        transformedData = transformedData.filter(novel => novel.status === "완결작");
      } else if (status === "미완결작") {
        transformedData = transformedData.filter(novel => novel.status === "연재중");
      }
      
      setCardList(transformedData);
    } else {
      setCardList([]);
    }
    
    setLoading(false);
  };
  
  // 장르 한글 변환
  const getGenreLabel = (genre) => {
    const found = genreList.find(g => g.value === genre);
    return found ? found.label : genre;
  };
  
  // 소설 ID에 맞는 이미지 가져오기
  const getNovelImage = (novelId) => {
    const novelImages = {
      1: Novel1, 2: Novel2, 3: Novel3, 4: Novel4, 5: Novel5,
      6: Novel6, 7: Novel7, 8: Novel8, 9: Novel9, 10: Novel10,
      11: Novel11, 12: Novel12, 13: Novel13, 14: Novel14, 15: Novel15,
      16: Novel16, 17: Novel17, 18: Novel18, 19: Novel19, 20: Novel20,
    };
    return novelImages[novelId] || Empty;
  };
  
  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const transformNovelData = (novels) => {
    return novels.map(novel => ({
      id: novel.novelId,
      img: getNovelImage(novel.novelId),
      genre: novel.genre,
      genreLabel: getGenreLabel(novel.genre),
      genreIcon: genreColors[novel.genre] || "📚",
      title: novel.novelName,
      author: novel.novelAuthor,
      stars: novel.averageRating || 0,
      reviews: novel.reviewCount || 0,
      status: novel.novelStatus === 'COMPLETED' ? '완결작' : '연재중',
    }));
  };
  
  // API 호출을 통해 웹소설 목록 가져오기
  useEffect(() => {
    const fetchNovels = async () => {
      setLoading(true);
      const result = await readNovelApi();
      if (result.ok && result.data) {
        const transformedData = transformNovelData(result.data);
        setCardList(transformedData);
      } else {
        // API 실패 시 초기 데이터 사용
        setCardList(initialCardData);
      }
      setLoading(false);
    };
    
    fetchNovels();
  }, []);
  // 현재 선택된 장르 정보
  const currentGenre = genreList[selectedGenreIndex];
  
  return (
    <div className={styles.pageContainer}>
      <Header/>
      <div className={styles.contentArea}>
        {/* 타이틀 영역 - 선택된 장르에 따라 변경 */}
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>{currentGenre.title}</h1>
          <p className={styles.mainContent}>{currentGenre.content}</p>
        </div>
        
        <GenreList 
          genreList={genreList} 
          selectedIndex={selectedGenreIndex}
          onGenreChange={handleGenreChange}
          onStatusChange={handleStatusChange}
        />
      </div>  
      <div className={styles.cardArea}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : cardList.length === 0 ? (
          <div className={styles.emptyMessage}>검색 결과가 없습니다</div>
        ) : (
          cardList.map((card, index) => (
            <Card key={card.id || index} card={card} 
            onClick={() => handleCardClick(card.id)}
            />
          ))
        )}
      </div>  
    </div>
  )
}
