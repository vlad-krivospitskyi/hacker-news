import { configureStore } from '@reduxjs/toolkit';
import newsReducer from '../app/reducers/newsReducer';

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});

export default store;
