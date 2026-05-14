import { createSlice } from "@reduxjs/toolkit";
import { ReviewModalState } from "../pages/review/engine/contracts/states";

const initialState: ReviewModalState = {
    bankItemId: null
};

export const reviewModalSlice = createSlice({
    name: 'reviewModal',
    initialState,
    reducers: {
        setBankItemId: ((state, action) => {
            state.bankItemId = action.payload
        })
    }
});

export const { setBankItemId } = reviewModalSlice.actions;
