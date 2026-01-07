import { useWindowWidthContext } from "next-common/context/windowSize";
import { isNil } from "lodash-es";

export default function WithPageWidth({ children }) {
  const width = useWindowWidthContext();
  return isNil(width) ? null : children;
}
