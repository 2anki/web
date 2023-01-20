/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlockControlState {
  index: number;
}

const initialState: BlockControlState = {
  index: 0,
};

export const blockControlSlice = createSlice({
  name: 'blockControl',
  initialState,
  reducers: {
    updateIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
  },
});

export const { updateIndex } = blockControlSlice.actions;

export default blockControlSlice.reducer;
