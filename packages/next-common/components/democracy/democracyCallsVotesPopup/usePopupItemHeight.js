import { useWindowWidthContext } from "next-common/context/windowSize";

export default function usePopupItemHeight() {
  const width = useWindowWidthContext();

  return width > 1024 ? 52 : 112;
}
