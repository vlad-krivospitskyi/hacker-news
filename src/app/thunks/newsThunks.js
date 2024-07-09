import { createAsyncThunk } from '@reduxjs/toolkit';
import { setTopStories, appendTopStories } from '../reducers/newsReducer';
import axios from 'axios';

export const fetchNestedComments = createAsyncThunk(
  'news/fetchNestedComments',
  async (commentId) => {
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
      return await Promise.all(nestedCommentPromises);
    }
    return [];
  }
);

export const fetchTopStoriesThunk = () => async (dispatch) => {
  try {
    const response = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    dispatch(setTopStories(response.data.slice(0, 20)));
  } catch (error) {
    console.error('Error fetching top stories:', error);
  }
};

export const fetchNewsItemThunk = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching news item:', error);
    return null;
  }
};

export const loadMoreStoriesThunk = (currentPage) => async (dispatch) => {
  try {
    const response = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    dispatch(
      appendTopStories(
        response.data.slice(20 * currentPage, 20 * (currentPage + 1))
      )
    );
  } catch (error) {
    console.error('Error loading more stories:', error);
  }
};
