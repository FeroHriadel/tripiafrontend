import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";



function categoriesAlphabetically(categories: Category[]) {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
}



const initialState: Category[] = [];

export const categoriesSlice = createSlice({
    initialState,
    name: `categoriesSlice`,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            return categoriesAlphabetically(action.payload);
        },
        addCategory: (state, action: PayloadAction<Category>) => {
            const newCategories = [...state, action.payload];
            return categoriesAlphabetically(newCategories);
        }
    }
});

export default categoriesSlice.reducer;
export const { setCategories, addCategory } = categoriesSlice.actions;
