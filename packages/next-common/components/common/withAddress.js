import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function WithAddress({ children }) {
  const realAddress = useRealAddress();
  return realAddress ? children : null;
}
