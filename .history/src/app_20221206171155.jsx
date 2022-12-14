import styles from './app.module.css';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SearchResult from './components/searchResult/searchResult';
import Page_num_screen from './components/page_num_screen/page_num_screen';
import QueryString from 'qs';
import ArrangeMenu from './components/arrangeMenu/arrangeMenu';
import PlaylistMenu from './components/playlistMenu/playlistMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import MainSec from './components/mainSec/mainSec';
import SongTableTitles from './components/songTableTitles/songTableTitles';
import SearchResults from './components/searchResults/searchResults';
import { useMediaQuery } from 'react-responsive';
import SongSearchBar from './components/songSearchBar/songSearchBar';

const App = ({
  buskingRepository,
  playlistRepository,
  userRepository,
  ipService,
}) => {
  const [isBusking, setIsBusking] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [buskingData, setBuskingData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [resultNum, setResultNum] = useState(0);
  const [resultNum2, setResultNum2] = useState(0);
  const [nowPageResults, setNowPageResults] = useState([]);
  const [nowPageResults2, setNowPageResults2] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageNum2, setPageNum2] = useState(1);
  const [appliance, setAppliance] = useState([]);
  const [applianceLength, setApplianceLength] = useState(0);
  const [playlists, setPlaylists] = useState(null);
  const [playlistsArr, setPlaylistsArr] = useState([]);
  const [nowPlaylist, setNowPlaylist] = useState(null);
  const [isShowArrangeMenu1, setIsShowArrangeMenu1] = useState(false);
  const [isShowArrangeMenu2, setIsShowArrangeMenu2] = useState(false);
  const [isShowPlaylistMenu, setIsShowPlaylistMenu] = useState(false);
  const [ip, setIp] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [searchCategory, setSearchCategory] = useState('??????');
  const location = useLocation();
  const queryData = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const userId = queryData.uid;
  const searchRef = useRef();
  const selectRef = useRef();
  const valueRef = useRef();
  const isPc = useMediaQuery({
    query: '(min-width:1024px)',
  });
  const search = () => {
    if (nowPlaylist && nowPlaylist.songs) {
      if (searchWord) {
        if (searchCategory === '??????') {
          setResults(
            Object.values(nowPlaylist.songs).filter((song) =>
              song.title.toLowerCase().includes(searchWord)
            )
          );
          setResultNum(results.length);
        } else if (searchCategory === '??????') {
          setResults(
            Object.values(nowPlaylist.songs).filter((song) =>
              song.artist.toLowerCase().includes(searchWord)
            )
          );
          setResultNum(results.length);
        }
      } else {
        setResults(Object.values(nowPlaylist.songs));
      }
    }
  };
  const plusPage = () => {
    if (pageNum < resultNum / 6) {
      setPageNum(pageNum + 1);
      setNowPageResults(results.slice((pageNum - 1) * 6, pageNum * 6));
    }
  };
  const minusPage = () => {
    if (pageNum !== 1) {
      setPageNum(pageNum - 1);
      setNowPageResults(results.slice((pageNum - 1) * 6, pageNum * 6));
    }
  };
  const plusPage2 = () => {
    if (pageNum2 < resultNum2 / 6) {
      setPageNum2(pageNum2 + 1);
      setNowPageResults2(results.slice((pageNum2 - 1) * 6, pageNum2 * 6));
    }
  };
  const minusPage2 = () => {
    if (pageNum2 !== 1) {
      setPageNum2(pageNum2 - 1);
      setNowPageResults2(results.slice((pageNum2 - 1) * 6, pageNum2 * 6));
    }
  };
  useEffect(() => {
    if (isUser) {
      playlistRepository.syncPlaylist(userId, (data) => {
        setPlaylists(data);
        setPlaylistsArr(Object.values(data));
      });
    }
  }, [isUser]);
  useEffect(() => {
    if (isUser) {
      if (playlistsArr.length > 0) {
        setNowPlaylist(playlistsArr[0]);
      }
    }
  }, [playlistsArr, isUser]);
  useEffect(() => {
    if (isUser) {
      if (nowPlaylist) {
        nowPlaylist.songs && setResults(Object.values(nowPlaylist.songs));
      }
    }
  }, [isUser, nowPlaylist]);
  useEffect(() => {
    ipService.getIp().then((ip1) => setIp(ip1));
  }, []);
  useEffect(() => {
    if ((pageNum - 1) * 6 + 1 > resultNum) {
      if (resultNum == 0) {
        return;
      }
      setPageNum(pageNum - 1);
    }
  }, [resultNum]);
  useEffect(() => {
    if ((pageNum2 - 1) * 6 + 1 > resultNum2) {
      if (resultNum2 == 0) {
        return;
      }
      setPageNum2(pageNum2 - 1);
    }
  }, [resultNum2]);

  useEffect(() => {
    if (buskingData && buskingData.appliance) {
      setAppliance(Object.values(buskingData.appliance));
      setApplianceLength(Object.values(buskingData.appliance).length);
      setResultNum2(Object.values(buskingData.appliance).length);
    } else {
      setAppliance([]);
      setApplianceLength(0);
      setResultNum2(0);
    }
  }, [
    buskingData,
    buskingData &&
      buskingData.appliance &&
      Object.values(buskingData.appliance).length,
  ]);

  useEffect(() => {
    setResultNum(results.length);
  }, [results.length]);

  useEffect(() => {
    if (userId && !isBusking) {
      //   console.log('?????????');
      buskingRepository.checkBusking(userId, (data) => {
        if (data) {
          setIsBusking(true);
        }
      });
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      userRepository.checkUser(userId, (ischeck) => {
        if (ischeck) {
          setIsUser(true);
        } else {
          setIsUser(false);
        }
      });
    } else {
      setIsUser(false);
    }
  }, [userId]);
  useEffect(() => {
    if (isBusking) {
      buskingRepository.syncBuskingData(userId, (data) => {
        if (data) {
          setBuskingData(data);
        }
      });
      userRepository.syncUserData(userId, (data) => {
        setName(data.name);
      });
    }
  }, [isBusking]);
  const onSearchBarChange = () => {
    setPageNum(1);
    search();
  };
  useEffect(() => {
    if (buskingData) {
      playlistRepository.syncPlaylist(userId, (data) => {
        setPlaylistData(data[buskingData.playlistId]);
      });
    }
  }, [buskingData]);
  useEffect(() => {
    if (playlistData) {
      playlistData.songs && setResults(Object.values(playlistData.songs));
    } else {
    }
  }, [playlistData]);
  const changeNowPlaylist = (id) => {
    if (playlists[id]) {
      setNowPlaylist(playlists[id]);
      if (playlists[id].songs) {
        setResults(Object.values(playlists[id].songs));
      } else {
        setResults([]);
      }
    }
  };
  return (
    <section className='flex py-4 px-8  h-screen w-full text-black bg-gradient-to-b from-blue-500 to-blue-900 overflow-auto'>
      <section className='w-full'>
        {isUser ? (
          isBusking ? (
            <section className='text-black'>
              <section className='border-gray-600 border-b items-center pt-3 pb-8 flex flex-row max-lg:flex-col max-lg:text-center'>
                <h1 className='font-sans text-white text-3xl font-semibold w-96 max-lg:w-full max-lg:mb-3'>
                  {buskingData && buskingData.name}
                </h1>
                <div className='flex flex-row items-center justify-end mr-4 grow max-lg:flex-col'>
                  <h2 className='font-sans text-white text-2xl font-semibold max-lg:mb-2'>
                    {!!name && `??????: ${name}`}
                  </h2>
                  <h2 className='font-sans text-white text-2xl font-semibold ml-8'>
                    {!!playlistData &&
                      `????????? ??????????????????: ${playlistData.name}`}
                  </h2>
                </div>
              </section>

              <MainSec>
                <h2 className='font-sans text-black font-semibold text-3xl'>
                  ???????????? ??? ?????????
                </h2>
                <div className='flex flex-row justify-end max-lg:justify-center mb-3'>
                  <h3 className='font-sans font-normal  text-xl text-gray-500'>
                    ???????????? ??? ??? {results.length}
                  </h3>
                </div>
                <SongSearchBar
                  searchWord={searchWord}
                  setSearchWord={setSearchWord}
                  searchCategory={searchCategory}
                  setSearchCategory={setSearchCategory}
                  onSearchBarChange={onSearchBarChange}
                >
                  <button
                    className='ml-5 bg-blue-600 py-2 px-3 text-lg rounded-lg text-white hover:scale-125'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsShowArrangeMenu1(true);
                    }}
                  >
                    ??????
                  </button>
                  {isShowArrangeMenu1 && (
                    <ArrangeMenu
                      setIsShowArrangeMenu={setIsShowArrangeMenu1}
                      results={results}
                      setResults={setResults}
                      isBusking={false}
                    />
                  )}
                </SongSearchBar>
                <section className='w-full'>
                  <ul>
                    {isPc && <SongTableTitles isApply={false} />}
                    <SearchResults
                      isSearch={false}
                      results={results}
                      pageNum={pageNum}
                      btnText={'??????'}
                      onSongClick={(sid) => {
                        if (buskingData.appliance) {
                          const applyArr = Object.values(buskingData.appliance);
                          const song = applyArr.find((song) => song.sid == sid);
                          if (song) {
                            const userIp = song.applicants.find(
                              (ap) => ap.ip == ip
                            );
                            if (!userIp) {
                              buskingRepository.applyOldBuskingSong(
                                userId,
                                sid,
                                ip,
                                song.cnt,
                                song.applicants,
                                () => {}
                              );
                            } else {
                              window.alert('?????? ?????????????????????!');
                            }
                          } else {
                            if (
                              appliance.length == parseInt(buskingData.maxNum)
                            ) {
                              alert(
                                '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                              );
                              return;
                            }
                            const song = results.find((s) => s.id == sid);
                            buskingRepository.applyNewBuskingSong(
                              userId,
                              song.title,
                              song.artist,
                              sid,
                              ip,
                              () => {}
                            );
                          }
                        } else {
                          if (
                            appliance.length == parseInt(buskingData.maxNum)
                          ) {
                            alert(
                              '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                            );
                            return;
                          }
                          const song = results.find((s) => s.id == sid);
                          buskingRepository.applyNewBuskingSong(
                            userId,
                            song.title,
                            song.artist,
                            sid,
                            ip,
                            () => {}
                          );
                        }
                      }}
                    />
                  </ul>
                  <Page_num_screen
                    resultNum={resultNum}
                    pageNum={pageNum}
                    onPagePlus={plusPage}
                    onPageMinus={minusPage}
                  />
                </section>
              </MainSec>

              <MainSec>
                <h2 className='font-sans text-black font-semibold text-3xl'>
                  ????????? ??? ?????????
                </h2>
                <section className='relative flex justify-end items-center mb-6'>
                  <h3 className='font-sans font-normal text-xl text-gray-500'>
                    ????????? ??? ??? {appliance.length}
                  </h3>
                  <div className='relative'>
                    <button
                      className='ml-5 bg-blue-600 py-2 px-3 text-lg rounded-lg text-white hover:scale-125'
                      onClick={() => {
                        setIsShowArrangeMenu2(true);
                      }}
                    >
                      ??????
                    </button>
                    {isShowArrangeMenu2 && (
                      <ArrangeMenu
                        setIsShowArrangeMenu={setIsShowArrangeMenu2}
                        results={appliance}
                        setResults={setAppliance}
                        isBusking={true}
                      />
                    )}
                  </div>
                </section>
                <section className='w-full'>
                  <ul>
                    {isPc && <SongTableTitles isApply={true} />}
                    <SearchResults
                      isSearch={false}
                      results={appliance}
                      pageNum={pageNum}
                      btnText={'????????????'}
                      onSongClick={(sid) => {
                        if (buskingData.appliance) {
                          const applyArr = Object.values(buskingData.appliance);
                          const song = applyArr.find((song) => song.sid == sid);
                          if (song) {
                            const userIp = song.applicants.find(
                              (ap) => ap.ip == ip
                            );
                            if (!userIp) {
                              buskingRepository.applyOldBuskingSong(
                                userId,
                                sid,
                                ip,
                                song.cnt,
                                song.applicants,
                                () => {}
                              );
                            } else {
                              window.alert('?????? ?????????????????????!');
                            }
                          } else {
                            if (
                              appliance.length == parseInt(buskingData.maxNum)
                            ) {
                              alert(
                                '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                              );
                              return;
                            }
                            buskingRepository.applyNewBuskingSong(
                              userId,
                              song.title,
                              song.artist,
                              sid,
                              ip,
                              () => {}
                            );
                          }
                        } else {
                          if (
                            appliance.length == parseInt(buskingData.maxNum)
                          ) {
                            alert(
                              '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                            );
                            return;
                          }
                          const song = results.find((s) => s.id == sid);
                          buskingRepository.applyNewBuskingSong(
                            userId,
                            song.title,
                            song.artist,
                            sid,
                            ip,
                            () => {}
                          );
                        }
                      }}
                    />
                  </ul>
                  <Page_num_screen
                    resultNum={resultNum2}
                    pageNum={pageNum2}
                    onPagePlus={plusPage2}
                    onPageMinus={minusPage2}
                  />
                </section>
              </MainSec>
            </section>
          ) : (
            <section>
              <MainSec>
                <h2 className='font-sans text-black text-xl font-semibold w-96 max-lg:w-full'>
                  ?????? ????????? ????????? ???????????? ????????????.
                </h2>
                <div className='flex relative flex-row items-center justify-end mr-4 grow'>
                  {isShowPlaylistMenu && (
                    <PlaylistMenu
                      setIsShowPlaylistMenu={setIsShowPlaylistMenu}
                      playlists={playlists}
                      changeNowPlaylist={changeNowPlaylist}
                      nowPlaylist={nowPlaylist}
                    />
                  )}
                  <button
                    ref={valueRef}
                    className='text-white font-sans text-xl hover:scale-110'
                    onClick={() => {
                      setIsShowPlaylistMenu(true);
                    }}
                  >
                    {nowPlaylist ? nowPlaylist.name : 'No Playlist..'}
                    <FontAwesomeIcon icon={faCaretDown} className='ml-2' />
                  </button>
                </div>
              </MainSec>

              {!nowPlaylist && (
                <section className='bg-white rounded-2xl m-auto w-3/4 mt-8 p-10 relative'>
                  <h2 className='text-black font-sans font-semibold text-3xl'>
                    ?????? ????????? ????????? ???????????? ???????????? ????????????.
                  </h2>
                </section>
              )}

              {nowPlaylist && (
                <MainSec>
                  <h2 className='font-sans text-black font-semibold text-3xl'>
                    {nowPlaylist && nowPlaylist.name}
                  </h2>
                  <div className='flex flex-row justify-end mb-3'>
                    <h3 className='font-sans font-normal text-xl text-gray-500'>
                      ??? ??? {results.length}
                    </h3>
                  </div>
                  <SongSearchBar
                    searchWord={searchWord}
                    setSearchWord={setSearchWord}
                    searchCategory={searchCategory}
                    setSearchCategory={setSearchCategory}
                    onSearchBarChange={onSearchBarChange}
                  >
                    <button
                      className='ml-5 bg-blue-600 py-2 px-3 text-lg rounded-lg text-white hover:scale-125'
                      onClick={(e) => {
                        e.preventDefault();
                        setIsShowArrangeMenu1(true);
                      }}
                    >
                      ??????
                    </button>
                    {isShowArrangeMenu1 && (
                      <ArrangeMenu
                        setIsShowArrangeMenu={setIsShowArrangeMenu1}
                        results={results}
                        setResults={setResults}
                        isBusking={false}
                      />
                    )}
                  </SongSearchBar>

                  <section className='w-full'>
                    <ul>
                      {isPc && <SongTableTitles isApply={false} />}
                      <SearchResults
                        isSearch={false}
                        results={results}
                        pageNum={pageNum}
                        btnText={'????????????'}
                        onSongClick={() => {}}
                      />
                    </ul>
                    <Page_num_screen
                      resultNum={resultNum}
                      pageNum={pageNum}
                      onPagePlus={plusPage}
                      onPageMinus={minusPage}
                    />
                  </section>
                </MainSec>
              )}
            </section>
          )
        ) : (
          <h1>???????????? ????????? ????????????????????????.</h1>
        )}
      </section>
    </section>
  );
};

export default App;
