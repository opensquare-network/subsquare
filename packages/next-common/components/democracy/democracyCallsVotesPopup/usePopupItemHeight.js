import useWindowSize from "next-common/utils/hooks/useWindowSize";

export default function usePopupItemHeight() {
  const { width } = useWindowSize();

  return width > 1024 ? 52 : 112;
}
