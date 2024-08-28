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
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            return state.filter(category => category.id !== action.payload);
        },
        replaceCategory: (state, action: PayloadAction<Category>) => {
            const newState = state.map(category =>
                category.id === action.payload.id ? action.payload : category
            );
            return categoriesAlphabetically(newState);
        }
    }
});

export default categoriesSlice.reducer;
export const { setCategories, addCategory, removeCategory, replaceCategory } = categoriesSlice.actions;
