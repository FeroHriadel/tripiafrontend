import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./slices/categoriesSlice";
import favoriteTripsSlice from "./slices/favoriteTripsSlice";
import invitationsSlice  from "./slices/invitationsSlice";
import { useDispatch, useSelector, useStore } from "react-redux";

export const makeStore = () => {
    return configureStore({reducer: {
        categories: categoriesSlice, 
        favoriteTrips: favoriteTripsSlice,
        invitations: invitationsSlice
    }})
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
