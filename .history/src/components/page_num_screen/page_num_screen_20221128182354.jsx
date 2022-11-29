import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

const Page_num_screen = ({ resultNum, pageNum, onPagePlus, onPageMinus }) => {
  const btnStyle =
    'mx-2 bg-black text-white rounded-full hover:scale-110 text-center text-lg w-8 h-8';
  return (
    <div className='flex justify-center mt-3'>
      <button className={btnStyle} onClick={() => onPageMinus()}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <p className='ml-2'>{pageNum}/</p>
      <p className='mr-2'>{parseInt((resultNum - 1) / 6) + 1}</p>
      <button className={btnStyle} onClick={() => onPagePlus()}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Page_num_screen;
