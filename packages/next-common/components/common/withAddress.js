import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function WithAddress({ children }) {
  const realAddress = useRealAddress();
  console.log("realAddress", realAddress);
  return realAddress ? children : null;
}
