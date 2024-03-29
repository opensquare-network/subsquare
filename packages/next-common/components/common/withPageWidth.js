import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";

export default function WithPageWidth({ children }) {
  const { width } = useWindowSize();
  return isNil(width) ? null : children;
}
