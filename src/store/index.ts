import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ventasUIReducer, { hydrate } from "./ventasSlice";

const STORAGE_KEY = "ventas:estadoTabla";

const rootReducer = combineReducers({
  ventasUI: ventasUIReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

function loadPreloadedState(): Partial<RootState> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return { ventasUI: parsed };
  } catch {
    return undefined;
  }
}

export const makeStore = () => {
  const preloaded = typeof window !== "undefined" ? loadPreloadedState() : undefined;
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloaded,
  });

  if (typeof window !== "undefined") {
    try {
      const current = store.getState().ventasUI;
      store.dispatch(hydrate(current));
      store.subscribe(() => {
        const state = store.getState().ventasUI;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      });
    } catch {}
  }

  return store;
};

export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
