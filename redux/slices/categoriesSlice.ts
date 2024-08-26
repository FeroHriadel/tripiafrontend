import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";


const initialState: Category[] = [];

export const categoriesSlice = createSlice({
    initialState,
    name: `categoriesSlice`,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            return action.payload;
        },
        //updateCategories: ...
    }
});

export default categoriesSlice.reducer;
export const { setCategories } = categoriesSlice.actions;
