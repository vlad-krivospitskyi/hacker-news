import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import newsReducer from '../app/reducers/newsReducer';

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});

export const fetchNewsById = async (id) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return response.data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const fetchCommentById = async (commentId) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
    );
    return response.data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const fetchNestedComments = async (commentId) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
    );
    const data = response.data;
    if (data.kids) {
      const nestedCommentPromises = data.kids.map(async (nestedCommentId) => {
        const nestedResponse = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${nestedCommentId}.json`
        );
        return nestedResponse.data;
      });
      const nestedComments = await Promise.all(nestedCommentPromises);
      return nestedComments;
    }
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
  return [];
};
