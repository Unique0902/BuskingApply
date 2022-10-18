import styles from './app.module.css';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SearchResult from './components/searchResult/searchResult';
import Page_num_screen from './components/page_num_screen/page_num_screen';
import QueryString from 'qs';

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
  const [ip, setIp] = useState('');
  const location = useLocation();
  const queryData = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const userId = queryData.uid;
  const searchRef = useRef();
  const selectRef = useRef();
  const search = () => {
    if (searchRef.current.value) {
      if (selectRef.current.value === '제목') {
        setResults(
          Object.values(playlistData.songs).filter((song) =>
            song.title.toLowerCase().includes(searchRef.current.value)
          )
        );
        setResultNum(results.length);
      } else if (selectRef.current.value === '가수') {
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
      //   console.log('중복좀');
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
    // console.log('중복좀');
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
    <section className={styles.body}>
      <section>
        {isUser ? (
          isBusking ? (
            <section>
              <section>
                <p>{name}님의 버스킹</p>
              </section>
              <section>
                <p>{playlistData && playlistData.name}</p>
                <section className={styles.searchBar}>
                  <select
                    ref={selectRef}
                    onChange={() => {
                      setPageNum(1);
                      search();
                    }}
                  >
                    <option value='제목'>제목</option>
                    <option value='가수'>가수</option>
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
                  <h2>신청가능곡 리스트</h2>
                  <h3>신청가능곡 수 {results.length}</h3>
                  <ul>
                    <li className={styles.description}>
                      <div className={styles.index}>index</div>
                      <div className={styles.name}>이름</div>
                      <div className={styles.artist}>아티스트</div>
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
                            btnText='신청'
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
                                    window.alert('이미 투표하셨습니다!');
                                  }
                                } else {
                                  if (
                                    appliance.length ==
                                    parseInt(buskingData.maxNum)
                                  ) {
                                    alert(
                                      '신청 최대수에 도달했습니다! 한 곡이 끝난후 신청해보세요!'
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
                                    '신청 최대수에 도달했습니다! 한 곡이 끝난후 신청해보세요!'
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
                    제목 문자순 정렬
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
                    가수 문자순 정렬
                  </button>
                </section>
                <section className={styles.results}>
                  <h2>신청된곡 리스트</h2>
                  <h3>신청된 곡 수 {appliance.length}</h3>
                  <ul>
                    <li className={styles.description}>
                      <div className={styles.index}>index</div>
                      <div className={styles.name2}>이름</div>
                      <div className={styles.artist2}>아티스트</div>
                      <div className={styles.appliance}>신청자수</div>
                      <div className={styles.btn}></div>
                    </li>
                    {appliance &&
                      appliance
                        .slice((pageNum2 - 1) * 6, pageNum2 * 6)
                        .map((result) => (
                          <SearchResult
                            key={appliance.indexOf(result)}
                            index={appliance.indexOf(result) + 1}
                            result={result}
                            btnText='나도신청'
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
                                    window.alert('이미 투표하셨습니다!');
                                  }
                                } else {
                                  if (
                                    appliance.length ==
                                    parseInt(buskingData.maxNum)
                                  ) {
                                    alert(
                                      '신청 최대수에 도달했습니다! 한 곡이 끝난후 신청해보세요!'
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
                                    '신청 최대수에 도달했습니다! 한 곡이 끝난후 신청해보세요!'
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
                                    //   console.log('와이라노');
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
                  <button
                    className={styles.btn}
                    onClick={() => {
                      appliance.sort(function (a, b) {
                        if (a.artist.toLowerCase() > b.artist.toLowerCase())
                          return 1;
                        else if (
                          a.artist.toLowerCase() < b.artist.toLowerCase()
                        )
                          return -1;
                        else return 0;
                      });
                      setAppliance([...appliance]);
                    }}
                  >
                    가수 문자순 정렬
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      appliance.sort(function (a, b) {
                        if (a.title.toLowerCase() > b.title.toLowerCase())
                          return 1;
                        else if (a.title.toLowerCase() < b.title.toLowerCase())
                          return -1;
                        else return 0;
                      });
                      setAppliance([...appliance]);
                    }}
                  >
                    제목 문자순 정렬
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      appliance.sort(function (a, b) {
                        return a.id - b.id;
                      });
                      setAppliance([...appliance]);
                    }}
                  >
                    신청 시간순 정렬
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      appliance.sort(function (a, b) {
                        return b.cnt - a.cnt;
                      });
                      setAppliance([...appliance]);
                    }}
                  >
                    신청자순 정렬
                  </button>
                </section>
              </section>
            </section>
          ) : (
            <section>
              <h2>해당 유저의 현재 진행중인 버스킹이 없습니다.</h2>
            </section>
          )
        ) : (
          <h1>해당하는 유저가 존재하지않습니다.</h1>
        )}
      </section>
    </section>
  );
};

export default App;
