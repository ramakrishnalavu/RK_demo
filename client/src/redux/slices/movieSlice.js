import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [],
    selected: null,
    filters: { genre: '', language: '', releaseYear: '', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setMovies: (state, action) => { state.list = action.payload; },
    setSelectedMovie: (state, action) => { state.selected = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearFilters: (state) => { state.filters = { genre: '', language: '', releaseYear: '', search: '' }; },
  },
});

export const { setMovies, setSelectedMovie, setFilters, setLoading, setError, clearFilters } = movieSlice.actions;
export default movieSlice.reducer;
