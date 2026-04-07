import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selectedShow: null,
    myBookings: [],
    currentBooking: null,
    loading: false,
  },
  reducers: {
    setSelectedShow: (state, action) => { state.selectedShow = action.payload; },
    setMyBookings: (state, action) => { state.myBookings = action.payload; },
    setCurrentBooking: (state, action) => { state.currentBooking = action.payload; },
    setBookingLoading: (state, action) => { state.loading = action.payload; },
    updateBookingStatus: (state, action) => {
      const idx = state.myBookings.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state.myBookings[idx] = action.payload;
    },
  },
});

export const { setSelectedShow, setMyBookings, setCurrentBooking, setBookingLoading, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
