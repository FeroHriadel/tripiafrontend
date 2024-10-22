import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invitation } from "@/types";



const initialState: Invitation[] = [];

export const invitationsSlice = createSlice({
    initialState,
    name: `invitationsSlice`,
    reducers: {
        setInvitations: (state, action: PayloadAction<Invitation[]>) => {
            const newState = action.payload;
            return newState;
        }
    }
});

export default invitationsSlice.reducer;
export const { setInvitations } = invitationsSlice.actions;