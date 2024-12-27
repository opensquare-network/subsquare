import { createContext, useContext } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

const WindowSizeContext = createContext({});

export default function WindowSizeProvider({ children }) {
  const { width, height } = useWindowSize();

  return (
    <WindowSizeContext.Provider
      value={{
        width,
        height,
      }}
    >
      {children}
    </WindowSizeContext.Provider>
  );
}

export function useWindowWidthContext() {
  const { width } = useContext(WindowSizeContext);
  return width;
}

export function useWindowHeightContext() {
  const { height } = useContext(WindowSizeContext);
  return height;
}

export function useWindowSizeContext() {
  return useContext(WindowSizeContext);
}
