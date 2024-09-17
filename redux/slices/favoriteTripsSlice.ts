import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";
import { act } from "react";



const initialState: string[] = [];

export const favoriteTripsSlice = createSlice({
    initialState,
    name: `favoriteTripsSlice`,
    reducers: {
        setFavoriteTrips: (state, action: PayloadAction<string[]>) => {
            return action.payload
        }
    }
});

export default favoriteTripsSlice.reducer;
export const { setFavoriteTrips } = favoriteTripsSlice.actions;
