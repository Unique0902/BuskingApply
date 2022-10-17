import React from 'react';
import styles from './page_num_screen.module.css';

const Page_num_screen = ({ resultNum, pageNum, onPagePlus, onPageMinus }) => {
  return (
    <div className={styles.screen}>
      <button className={styles.btn} onClick={() => onPageMinus()}>
        {'<'}
      </button>
      <p>{pageNum}/</p>
      <p>{parseInt(resultNum / 6) + 1}</p>
      <button className={styles.btn} onClick={() => onPagePlus()}>
        {'>'}
      </button>
    </div>
  );
};

export default Page_num_screen;
