import React from 'react';
import { useRef, useEffect } from 'react';

const ArrangeMenu = ({
  setIsShowArrangeMenu,
  results,
  setResults,
  isBusking,
}) => {
  const wrapperRef = useRef();
  const btnStyle =
    'font-sans text-black text-lg text-left py-1 px-4 hover:bg-gray-200';
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowArrangeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div
      ref={wrapperRef}
      className=' w-60 border-gray-600 border bg-white text-black absolute top-0 left-0 rounded-xl z-50'
    >
      <section className=' border-b border-gray-600 border-solid flex flex-col pt-2 pb-2'>
        <button
          className={btnStyle}
          onClick={() => {
            results.sort(function (a, b) {
              if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
              else if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
              else return 0;
            });
            setResults([...results]);
            setIsShowArrangeMenu(false);
          }}
        >
          제목 문자순 정렬
        </button>
        <button
          className={btnStyle}
          onClick={() => {
            results.sort(function (a, b) {
              if (a.artist.toLowerCase() > b.artist.toLowerCase()) return 1;
              else if (a.artist.toLowerCase() < b.artist.toLowerCase())
                return -1;
              else return 0;
            });
            setResults([...results]);
            setIsShowArrangeMenu(false);
          }}
        >
          가수 문자순 정렬
        </button>
        <button
          className={btnStyle}
          onClick={() => {
            results.sort(function (a, b) {
              return a.id - b.id;
            });
            setResults([...results]);
            setIsShowArrangeMenu(false);
          }}
        >
          시간순 정렬
        </button>
        {isBusking && (
          <button
            className={btnStyle}
            onClick={() => {
              results.sort(function (a, b) {
                return b.cnt - a.cnt;
              });
              setResults([...results]);
            }}
          >
            신청자순 정렬
          </button>
        )}
      </section>
    </div>
  );
};

export default ArrangeMenu;
