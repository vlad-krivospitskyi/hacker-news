import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NewsItem from './NewsItem';
import { setTopStories } from '../reducers/newsReducer';

const NewsPage = () => {
  const dispatch = useDispatch();
  const topStories = useSelector((state) => state.news.topStories);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await axios.get(
          'https://hacker-news.firebaseio.com/v0/topstories.json'
        );
        dispatch(setTopStories(response.data.slice(0, 100)));
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchTopStories();
  }, [dispatch]);

  return (
    <>
      <h1 className="text-2xl font-bold">Новости</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => window.location.reload()}
      >
        Обновить
      </button>
      {topStories.map((storyId) => (
        <NewsItem key={storyId} id={storyId} />
      ))}
    </>
  );
};

export default NewsPage;
