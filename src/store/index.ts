import { configureStore } from "@reduxjs/toolkit";
import transacoesReducer from "./slices/transacoesSlice";

export const store = configureStore({
  reducer: {
    transacoes: transacoesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;