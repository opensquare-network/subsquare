import isNil from "lodash.isnil";

export default function NotNil({ value, children }) {
  if (isNil(value)) {
    return null;
  }

  return children;
}
