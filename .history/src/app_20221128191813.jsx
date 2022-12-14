import styles from './app.module.css';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SearchResult from './components/searchResult/searchResult';
import Page_num_screen from './components/page_num_screen/page_num_screen';
import QueryString from 'qs';
import ArrangeMenu from './components/arrangeMenu/arrangeMenu';

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
  const [ip, setIp] = useState('');
  const location = useLocation();
  const queryData = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const userId = queryData.uid;
  const searchRef = useRef();
  const selectRef = useRef();
  const valueRef = useRef();
  const changeNowPlaylist = () => {
    setNowPlaylist(
      playlistsArr.find((list) => list.name === valueRef.current.value)
    );
  };
  const search = () => {
    if (searchRef.current.value) {
      if (selectRef.current.value === '??????') {
        setResults(
          Object.values(playlistData.songs).filter((song) =>
            song.title.toLowerCase().includes(searchRef.current.value)
          )
        );
        setResultNum(results.length);
      } else if (selectRef.current.value === '??????') {
        setResults(
          Object.values(playlistData.songs).filter((song) =>
            song.artist.toLowerCase().includes(searchRef.current.value)
          )
        );
        setResultNum(results.length);
      }
    } else {
      setResults(Object.values(playlistData.songs));
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
    // console.log('?????????');
    if (isBusking) {
      buskingRepository.syncBuskingData(userId, (data) => {
        if (data) {
          //   console.log(data);
          setBuskingData(data);
        }
      });
      userRepository.syncUserData(userId, (data) => {
        setName(data.name);
      });
    }
  }, [isBusking]);

  useEffect(() => {
    if (buskingData) {
      //   console.log(userId);
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
  return (
    <section className='flex py-6 px-8  h-screen w-full text-black bg-gradient-to-b from-blue-500 to-blue-900 overflow-auto'>
      <section className='w-full'>
        {isUser ? (
          isBusking ? (
            <section className='text-black'>
              <section className='border-gray-600 border-b items-center pt-3 pb-8 flex flex-row'>
                <h1 className='font-sans text-white text-3xl font-semibold w-96'>
                  {buskingData && buskingData.name}
                </h1>
                <div className='flex flex-row items-center grow'>
                  <h2 className='font-sans text-white text-2xl font-semibold'>
                    {!!name && `??????: ${name}`}
                  </h2>
                  <h2 className='font-sans text-white text-2xl font-semibold ml-8'>
                    {!!playlistData &&
                      `????????? ??????????????????: ${playlistData.name}`}
                  </h2>
                </div>
              </section>
              <section className='bg-white rounded-2xl m-auto w-3/4 mt-8 p-10 relative'>
                <div className='flex flex-row justify-between mb-5'>
                  <h2 className='font-sans text-black font-semibold text-3xl'>
                    ??????????????? ?????????
                  </h2>
                  <h3 className='font-sans font-normal text-xl text-gray-500'>
                    ??????????????? ??? {results.length}
                  </h3>
                </div>

                <section className='relative flex justify-center items-center mb-6'>
                  <select
                    ref={selectRef}
                    className=' border-black border-2 rounded-xl p-2 font-sans text-lg mr-4'
                    onChange={() => {
                      setPageNum(1);
                      search();
                    }}
                  >
                    <option value='??????'>??????</option>
                    <option value='??????'>??????</option>
                  </select>
                  <input
                    type='search'
                    className='border-black border-2 p-2 rounded-xl w-2/5 font-sans text-lg'
                    placeholder='???????????? ???????????????..'
                    ref={searchRef}
                    onChange={() => {
                      setPageNum(1);
                      search();
                    }}
                  />
                  <div className='relative'>
                    <button
                      className='ml-5 bg-blue-600 py-2 px-3 text-lg rounded-lg text-white hover:scale-125'
                      onClick={() => {
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
                  </div>
                </section>
                <section className='w-full'>
                  <ul>
                    <li className='flex flex-row justify-between  text-center px-2 py-1'>
                      <div className=' basis-1/12 text-black'>index</div>
                      <div className='basis-7/12 text-black'>??????</div>
                      <div className='basis-1/4 text-black'>????????????</div>
                      <div className='basis-1/12 text-black'></div>
                    </li>
                    {results &&
                      results
                        .slice((pageNum - 1) * 6, pageNum * 6)
                        .map((result) => (
                          <SearchResult
                            key={results.indexOf(result)}
                            index={results.indexOf(result) + 1}
                            result={result}
                            btnText='??????'
                            onSongClick={(sid) => {
                              if (buskingData.appliance) {
                                const applyArr = Object.values(
                                  buskingData.appliance
                                );
                                const song = applyArr.find(
                                  (song) => song.sid == sid
                                );
                                if (song) {
                                  // console.log(1);
                                  const userIp = song.applicants.find(
                                    (ap) => ap.ip == ip
                                  );
                                  if (!userIp) {
                                    //   console.log(userIp);
                                    buskingRepository.applyOldBuskingSong(
                                      userId,
                                      sid,
                                      ip,
                                      song.cnt,
                                      song.applicants,
                                      () => {}
                                    );
                                  } else {
                                    //   console.log(userIp);
                                    window.alert('?????? ?????????????????????!');
                                  }
                                } else {
                                  if (
                                    appliance.length ==
                                    parseInt(buskingData.maxNum)
                                  ) {
                                    alert(
                                      '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                                    );
                                    return;
                                  }
                                  // console.log(2);
                                  buskingRepository.applyNewBuskingSong(
                                    userId,
                                    result.title,
                                    result.artist,
                                    sid,
                                    ip,
                                    () => {}
                                  );
                                }
                              } else {
                                if (
                                  appliance.length ==
                                  parseInt(buskingData.maxNum)
                                ) {
                                  alert(
                                    '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                                  );
                                  return;
                                }
                                //   console.log(3);
                                buskingRepository.applyNewBuskingSong(
                                  userId,
                                  result.title,
                                  result.artist,
                                  sid,
                                  ip,
                                  () => {}
                                );
                              }
                            }}
                          />
                        ))}
                  </ul>
                  <Page_num_screen
                    resultNum={resultNum}
                    pageNum={pageNum}
                    onPagePlus={plusPage}
                    onPageMinus={minusPage}
                  />
                </section>
              </section>

              <section className='bg-white rounded-2xl m-auto w-3/4 mt-8 p-10 relative'>
                <h2 className='font-sans text-black font-semibold text-3xl'>
                  ???????????? ?????????
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
                    <li className='flex flex-row justify-between text-center px-2 py-1'>
                      <div className=' basis-1/12 text-black'>index</div>
                      <div className='basis-1/2 text-black'>??????</div>
                      <div className='basis-1/4 text-black'>????????????</div>
                      <div className='basis-1/12 text-black'>????????????</div>
                      <div className='basis-1/12 text-black'></div>
                    </li>
                    {appliance &&
                      appliance
                        .slice((pageNum - 1) * 6, pageNum * 6)
                        .map((result) => (
                          <SearchResult
                            key={appliance.indexOf(result)}
                            index={appliance.indexOf(result) + 1}
                            result={result}
                            btnText='????????????'
                            onSongClick={(sid) => {
                              if (buskingData.appliance) {
                                const applyArr = Object.values(
                                  buskingData.appliance
                                );
                                const song = applyArr.find(
                                  (song) => song.sid == sid
                                );
                                //   console.log(song);
                                if (song) {
                                  // console.log(1);
                                  const userIp = song.applicants.find(
                                    (ap) => ap.ip == ip
                                  );
                                  if (!userIp) {
                                    //   console.log(userIp);
                                    buskingRepository.applyOldBuskingSong(
                                      userId,
                                      sid,
                                      ip,
                                      song.cnt,
                                      song.applicants,
                                      () => {}
                                    );
                                  } else {
                                    //   console.log(userIp);
                                    window.alert('?????? ?????????????????????!');
                                  }
                                } else {
                                  if (
                                    appliance.length ==
                                    parseInt(buskingData.maxNum)
                                  ) {
                                    alert(
                                      '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                                    );
                                    return;
                                  }
                                  // console.log(2);
                                  buskingRepository.applyNewBuskingSong(
                                    userId,
                                    result.title,
                                    result.artist,
                                    sid,
                                    ip,
                                    () => {}
                                  );
                                }
                              } else {
                                if (
                                  appliance.length ==
                                  parseInt(buskingData.maxNum)
                                ) {
                                  alert(
                                    '?????? ???????????? ??????????????????! ??? ?????? ????????? ??????????????????!'
                                  );
                                  return;
                                }
                                //   console.log(3);
                                buskingRepository.applyNewBuskingSong(
                                  userId,
                                  result.title,
                                  result.artist,
                                  sid,
                                  ip,
                                  () => {
                                    //   console.log('????????????');
                                  }
                                );
                              }
                            }}
                          />
                        ))}
                  </ul>
                  <Page_num_screen
                    resultNum={resultNum2}
                    pageNum={pageNum2}
                    onPagePlus={plusPage2}
                    onPageMinus={minusPage2}
                  />
                </section>
              </section>
            </section>
          ) : (
            <section>
              <h2>?????? ????????? ?????? ???????????? ???????????? ????????????.</h2>
              <section>
                <p>{playlistData && playlistData.name}</p>
                {playlistsArr.length != 0 ? (
                  <select
                    ref={valueRef}
                    className={styles.playlists}
                    onChange={() => {
                      changeNowPlaylist();
                    }}
                  >
                    {playlistsArr.map((playlist) => {
                      return (
                        <option data-id={playlist.id} key={playlist.id}>
                          {playlist.name && playlist.name}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div>
                    <p>No Playlist..</p>
                  </div>
                )}
                <section className={styles.searchBar}>
                  <select
                    ref={selectRef}
                    onChange={() => {
                      setPageNum(1);
                      search();
                    }}
                  >
                    <option value='??????'>??????</option>
                    <option value='??????'>??????</option>
                  </select>
                  <input
                    type='search'
                    placeholder='search..'
                    ref={searchRef}
                    onChange={() => {
                      setPageNum(1);
                      search();
                    }}
                  />
                </section>
                <section className={styles.results}>
                  <h2>?????? ????????? ????????? ?????????</h2>
                  <h3>????????????????????? ??? ??? {results.length}</h3>
                  <ul>
                    <li className={styles.description}>
                      <div className={styles.index}>index</div>
                      <div className={styles.name}>??????</div>
                      <div className={styles.artist}>????????????</div>
                      <div className={styles.btn}></div>
                    </li>
                    {results &&
                      results
                        .slice((pageNum - 1) * 6, pageNum * 6)
                        .map((result) => (
                          <SearchResult
                            key={results.indexOf(result)}
                            index={results.indexOf(result) + 1}
                            result={result}
                            btnText={'????????????'}
                            onSongClick={() => {}}
                          />
                        ))}
                  </ul>
                  <Page_num_screen
                    resultNum={resultNum}
                    pageNum={pageNum}
                    onPagePlus={plusPage}
                    onPageMinus={minusPage}
                  />
                  <button
                    className={styles.btn}
                    onClick={() => {
                      results.sort(function (a, b) {
                        if (a.title.toLowerCase() > b.title.toLowerCase())
                          return 1;
                        else if (a.title.toLowerCase() < b.title.toLowerCase())
                          return -1;
                        else return 0;
                      });
                      setResults([...results]);
                    }}
                  >
                    ?????? ????????? ??????
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      results.sort(function (a, b) {
                        if (a.artist.toLowerCase() > b.artist.toLowerCase())
                          return 1;
                        else if (
                          a.artist.toLowerCase() < b.artist.toLowerCase()
                        )
                          return -1;
                        else return 0;
                      });
                      setResults([...results]);
                    }}
                  >
                    ?????? ????????? ??????
                  </button>
                </section>
              </section>
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
