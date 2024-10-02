import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeDuplicates } from "@/utils/arrays";



const initialState: string[] = [];

export const favoriteTripsSlice = createSlice({
    initialState,
    name: `favoriteTripsSlice`,
    reducers: {
        setFavoriteTrips: (state, action: PayloadAction<string[]>) => {
            const newState = removeDuplicates(action.payload);
            return newState;
        }
    }
});

export default favoriteTripsSlice.reducer;
export const { setFavoriteTrips } = favoriteTripsSlice.actions;
