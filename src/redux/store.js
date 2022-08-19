import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter";
import multipleChoiceReducer from "@/redux/slices/multiple-choice.slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    multipleChoice: multipleChoiceReducer
  },
});
