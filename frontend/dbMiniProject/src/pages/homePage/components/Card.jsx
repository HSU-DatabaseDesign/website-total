import React from 'react'
import styles from './Card.module.scss'

export const Card = ({ card, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className={styles.cardImage}>
        <div className={styles.genreIcon}>{card.genreIcon || "📚"}</div>
        <img src={card.img} alt={card.title} />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{card.title}</div>
        <div className={styles.cardAuthor}>{card.author}</div>
        <div className={styles.cardGenre}>{card.genreLabel || card.genre}</div>
        <div className={styles.cardStars}>⭐ {card.stars?.toFixed(1) || 0}</div>
        <div className={styles.cardReviews}>리뷰 {card.reviews}개</div>
        <div className={styles.cardStatus}>{card.status}</div>
      </div>
    </div>
  )
}
