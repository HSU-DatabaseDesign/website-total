import React, { useState } from 'react'
import styles from './GenreList.module.scss'

export const GenreList = ({ genreList, selectedIndex, onGenreChange, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  
  const statusList = ["전체", "미완결작", "완결작"];
  
  const handleGenreClick = (index) => {
    if (onGenreChange) {
      // index를 전달 (부모에서 장르 정보 관리)
      onGenreChange(index);
    }
  };
  
  const handleStatusClick = (index) => {
    setCurrentStatus(index);
    if (onStatusChange) {
      onStatusChange(statusList[index]);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <nav className={styles.genreNav}>
        {genreList.map((genre, index) => (
          <button
            key={index}
            className={`${styles.genreButton} ${selectedIndex === index ? styles.active : ''}`}
            onClick={() => handleGenreClick(index)}
          >
            {genre.label}
          </button>
        ))}
      </nav>
      <nav className={styles.genreNav2}>
        {statusList.map((status, index) => (
          <button
            key={index}
            className={`${styles.genreButton} ${currentStatus === index ? styles.active : ''}`}
            onClick={() => handleStatusClick(index)}
          >
            {status}
          </button>
        ))}
      </nav>
    </div>
  )
}
