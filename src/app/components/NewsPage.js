// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import NewsItem from './NewsItem';
// import { setTopStories } from '../reducers/newsReducer';

// const NewsPage = () => {
//   const dispatch = useDispatch();
//   const topStories = useSelector((state) => state.news.topStories);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTopStories = async () => {
//       try {
//         const response = await axios.get(
//           'https://hacker-news.firebaseio.com/v0/topstories.json'
//         );
//         dispatch(setTopStories(response.data.slice(0, 100)));
//       } catch (error) {
//         console.error('Error', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopStories();
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <h1 className="text-2xl font-bold">Новости</h1>
//       <button
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//         onClick={() => window.location.reload()}
//       >
//         Обновить
//       </button>
//       {topStories.map((storyId) => (
//         <NewsItem key={storyId} id={storyId} />
//       ))}
//     </>
//   );
// };

// export default NewsPage;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NewsItem from './NewsItem';
import { setTopStories } from '../reducers/newsReducer';
import { fetchTopStoriesThunk } from '../thunks/newsThunks';

const NewsPage = () => {
  const dispatch = useDispatch();
  const topStories = useSelector((state) => state.news.topStories);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const newsEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTopStoriesThunk()).then(() => setLoading(false));
  }, [dispatch]);

  const loadMoreStories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://hacker-news.firebaseio.com/v0/topstories.json'
      );
      dispatch(setTopStories(response.data.slice(0, 20 * currentPage)));
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newsEndRef.current) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [topStories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Новости</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
        onClick={() => window.location.reload()}
      >
        Обновить
      </button>
      {topStories.map((storyId) => (
        <NewsItem key={storyId} id={storyId} />
      ))}
      <div ref={newsEndRef}></div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={loadMoreStories}
        >
          Загрузить еще
        </button>
      </div>
    </>
  );
};

export default NewsPage;
