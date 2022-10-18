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
            <></>
          ) : (
            <></>
          )
        ) : (
          <h1>해당하는 유저가 존재하지않습니다.</h1>
        )}
      </section>
    </section>
  );
};

export default App;
