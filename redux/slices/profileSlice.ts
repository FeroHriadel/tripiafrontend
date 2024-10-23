import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types";



const initialState: UserProfile = {email: '', profilePicture: '', groups: [], nickname: '', about: ''}

export const profileSlice = createSlice({
    initialState,
    name: `profileSlice`,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            const newState = action.payload;
            return newState;
        }
    }
});

export default profileSlice.reducer;
export const { setProfile } = profileSlice.actions;