import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchNewsItemThunk } from '../thunks/newsThunks';

const NewsItem = ({ id }) => {
  const [news, setNews] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await dispatch(fetchNewsItemThunk(id));
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news item:', error);
      }
    };

    fetchNews();
  }, [dispatch, id]);

  if (!news) {
    return null;
  }

  const { title, by, score, time } = news;
  const date = new Date(time * 1000);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mx-auto p-4 max-w-2xl my-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          to={`/news/${id}`}
          className="text-xl font-bold text-blue-600 w-full hover:underline"
        >
          {title}
        </Link>
      </div>
      <p className="text-base text-white">Автор: {by}</p>
      <p className="text-base text-white">Рейтинг: {score}</p>
      <p className="text-base text-white">
        Дата публикации: {date.toLocaleString()}
      </p>
    </div>
  );
};

export default NewsItem;
