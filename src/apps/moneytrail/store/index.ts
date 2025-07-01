import { combineSlices } from "@reduxjs/toolkit";
import { reviewSlice } from "./reviewSlice";
import { reviewModalSlice } from "./reviewModalSlice";

export const moneyTrailReducer = combineSlices(
    reviewSlice,
    reviewModalSlice
);