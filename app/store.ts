"use client";
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./features/content/contentSlice";
import tutorialReducer from "./features/tutorial/tutorialSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    tutorial: tutorialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
