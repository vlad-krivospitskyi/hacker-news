const initialState = {
  topStories: [],
  currentNews: null,
};

export const setTopStories = (stories) => ({
  type: 'SET_TOP_STORIES',
  payload: stories,
});

export const appendTopStories = (stories) => ({
  type: 'APPEND_TOP_STORIES',
  payload: stories,
});

export const setCurrentNews = (news) => ({
  type: 'SET_CURRENT_NEWS',
  payload: news,
});

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOP_STORIES':
      return {
        ...state,
        topStories: action.payload,
      };
    case 'APPEND_TOP_STORIES':
      return {
        ...state,
        topStories: [...state.topStories, ...action.payload],
      };
    case 'SET_CURRENT_NEWS':
      return {
        ...state,
        currentNews: action.payload,
      };
    default:
      return state;
  }
};

export default newsReducer;
