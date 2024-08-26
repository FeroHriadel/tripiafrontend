'use client'

import { useEffect } from "react";
import { apiCalls } from "@/utils/apiCalls";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCategories } from "@/redux/slices/categoriesSlice";

export const dynamic = 'force-dynamic';



const CategoriesFetcher = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories);

  async function fetchCategories() {
    const res = await apiCalls.get('/categories');
    dispatch(setCategories(res));
  };

  useEffect(() => {fetchCategories();}, []);

  return (<></>);
};

export default CategoriesFetcher;

