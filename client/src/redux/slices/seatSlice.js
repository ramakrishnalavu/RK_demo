import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
    selectedSeats: [],
    loading: false,
  },
  reducers: {
    setSeats: (state, action) => { state.seats = Array.isArray(action.payload) ? action.payload : []; },
    toggleSeat: (state, action) => {
      const seat = action.payload;
      const idx = state.selectedSeats.findIndex(s => s === seat);
      if (idx > -1) {
        state.selectedSeats.splice(idx, 1);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state) => { state.selectedSeats = []; },
    setSeatsLoading: (state, action) => { state.loading = action.payload; },
  },
});

export const { setSeats, toggleSeat, clearSelectedSeats, setSeatsLoading } = seatSlice.actions;
export default seatSlice.reducer;
