import { useContextApi } from "next-common/context/api";

export default function WithApi({ children }) {
  const api = useContextApi();
  return api ? children : null;
}
