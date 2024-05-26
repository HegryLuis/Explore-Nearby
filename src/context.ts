import { AppContext } from "interfaces";
import { createContext, useContext } from "react";

const context = createContext<AppContext | null>(null);

export const useApp = () => {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error("This hook should be used inside App component");
  }

  return ctx;
};

export const { Provider } = context;
