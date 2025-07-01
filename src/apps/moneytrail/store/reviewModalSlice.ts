import { createSlice } from "@reduxjs/toolkit";
import { Nullable } from "../../../engine/models/types";

interface ReviewModalState {
    bankItemId: Nullable<string>;
}

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