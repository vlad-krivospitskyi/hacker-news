import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCurrentNews } from '../reducers/newsReducer';
import {
  fetchNewsById,
  fetchCommentById,
  fetchNestedComments,
} from '../../store/store';

const NewsItemDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const news = useSelector((state) => state.news.currentNews);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await fetchNewsById(id);
        dispatch(setCurrentNews(data));
        if (data.kids) {
          setCommentCount(data.kids.length);
          fetchComments(data.kids);
        }
      } catch (error) {
        console.error('Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [dispatch, id]);

  const fetchComments = async (commentIds) => {
    try {
      const commentPromises = commentIds.map(async (commentId) => {
        const comment = await fetchCommentById(commentId);
        return comment;
      });
      const commentsData = await Promise.all(commentPromises);
      setComments(commentsData);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const fetchNestedCommentsWrapper = async (commentId) => {
    try {
      const nestedComments = await fetchNestedComments(commentId);
      return nestedComments;
    } catch (error) {
      console.error('Error', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  const { title, by, time, url } = news;
  const date = new Date(time * 1000).toLocaleString();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 relative">
        <button
          className="close-btn absolute top-2 right-2 hover:text-gray-900"
          onClick={() => window.history.back()}
        >
          &times;
        </button>
        <div className="header-text flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center w-full">{title}</h1>
        </div>
        <p className="author text-base text-gray-600">Автор: {by}</p>
        <p className="text-base text-gray-600">Дата публикации: {date}</p>
        <a href={url} className="text-blue-500 underline">
          Ссылка на новость
        </a>
        <p className="text-base text-gray-600 mt-4">
          Количество комментариев: {commentCount}
        </p>
        <button
          className={`text-blue-500 underline ${
            commentCount === 0 ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() =>
            commentCount > 0 && setIsCommentsCollapsed(!isCommentsCollapsed)
          }
          disabled={commentCount === 0}
        >
          {isCommentsCollapsed
            ? 'Показать комментарии'
            : 'Свернуть комментарии'}
        </button>
        <div className="mt-4">
          {!isCommentsCollapsed &&
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                fetchNestedComments={fetchNestedCommentsWrapper}
              />
            ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="btn bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => fetchComments(news.kids || [])}
          >
            Обновить комментарии
          </button>
          <button
            className="btn bg-gray-500 text-white py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Список новостей
          </button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ comment, fetchNestedComments }) => {
  const [nestedComments, setNestedComments] = useState([]);
  const [isNestedLoaded, setIsNestedLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const loadNestedComments = async () => {
    if (!isNestedLoaded) {
      const nested = await fetchNestedComments(comment.id);
      setNestedComments(nested);
      setIsNestedLoaded(true);
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="ml-4 mt-2">
      <p className="text-base text-gray-600">{comment.by}</p>
      <p
        className="text-base text-gray-600"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      ></p>
      {comment.kids && (
        <button
          className="text-blue-500 underline"
          onClick={loadNestedComments}
        >
          {isCollapsed
            ? 'Показать вложенные комментарии'
            : 'Свернуть вложенные комментарии'}
        </button>
      )}
      {!isCollapsed &&
        nestedComments.map((nestedComment) => (
          <Comment
            key={nestedComment.id}
            comment={nestedComment}
            fetchNestedComments={fetchNestedComments}
          />
        ))}
    </div>
  );
};

export default NewsItemDetail;
