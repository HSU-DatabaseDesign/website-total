import React, { useState } from 'react'
import styles from './title.module.scss'

export const Title = ({ titleList }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  return (
    <div className={styles.container}>
      <nav className={styles.navWrapper}>
        {titleList.map((item, index) => (
          <button
            key={index}
            className={`${styles.navButton} ${selectedIndex === index ? styles.active : ''}`}
            onClick={() => setSelectedIndex(index)}
          >
            {item.navTitle}
          </button>
        ))}
      </nav>
      
      <div className={styles.contentWrapper}>
        <div className={styles.titleSection}>
          <div className={styles.title}>{titleList[selectedIndex].title}</div>
        </div>
        <div className={styles.contentSection}>
          <p className={styles.content}>{titleList[selectedIndex].content}</p>
        </div>
      </div>
    </div>
  )
}
