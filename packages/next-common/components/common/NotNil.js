import { isNil } from "lodash-es";

export default function NotNil({ value, children }) {
  if (isNil(value)) {
    return null;
  }

  return children;
}
