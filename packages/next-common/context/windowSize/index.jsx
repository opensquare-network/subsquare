import { useContext } from "react";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { createSingletonContextProvider } from "../singleton";

const { Context: WindowSizeContext, Provider: WindowSizeProvider } =
  createSingletonContextProvider(useWindowSize);

export default WindowSizeProvider;

export function useWindowSizeContext() {
  return useContext(WindowSizeContext) || {};
}

export function useWindowWidthContext() {
  const { width } = useWindowSizeContext();
  return width;
}

export function useWindowHeightContext() {
  const { height } = useWindowSizeContext();
  return height;
}
