import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const SearchResult = ({ index, result, onSongClick, btnText }) => {
  const nameRef = useRef();
  const artistRef = useRef();
  const [sid, getSid] = useState('');
  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  useEffect(() => {
    result.sid ? getSid(result.sid) : getSid(result.id);
  }, [result]);
  return (
    <li className='flex flex-row w-full text-white font-sans font-light bg-black rounded-xl mb-4 text-base justify-between px-2 py-2 text-center'>
      <p className='basis-1/12'>{index}</p>
      <div
        ref={nameRef}
        className='basis-7/12 relative'
        onMouseOver={() => setIsHovering1(true)}
        onMouseOut={() => setIsHovering1(false)}
      >
        {btnText == '제거' && result.title.length > 20
          ? result.title.slice(0, 20) + '..'
          : result.title}
        {btnText == '추가' && result.name.length > 20
          ? result.name.slice(0, 20) + '..'
          : result.name}
        {btnText == '제거' && isHovering1 && (
          <p className='absolute bg-white rounded-lg border border-gray-500 p-2 text-black'>
            {result.title}
          </p>
        )}
        {btnText == '추가' && isHovering1 && (
          <p className='absolute bg-white rounded-lg border border-gray-500 p-2 text-black'>
            {result.name}
          </p>
        )}
      </div>
      <div
        ref={artistRef}
        className='basis-1/4 relative'
        onMouseOver={() => setIsHovering2(true)}
        onMouseOut={() => setIsHovering2(false)}
      >
        {result.artist.length > 10
          ? result.artist.slice(0, 10) + '..'
          : result.artist}
        {isHovering2 && (
          <p className='absolute rounded-lg border border-gray-500 p-2 bg-white text-black'>
            {result.artist}
          </p>
        )}
      </div>
      {result.cnt && <p className='basis-1/12'>{result.cnt}</p>}
      <button
        onClick={() => {
          btnText === '추가'
            ? onSongClick(result.name, result.artist)
            : onSongClick(sid);
        }}
        className='basis-1/12 hover:scale-110'
      >
        {btnText}
      </button>
    </li>
  );
};

export default SearchResult;
