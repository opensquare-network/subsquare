import { tryInitMimir } from "next-common/utils/mimir";
import { useEffect } from "react";

export default function useInitMimir() {
  useEffect(() => {
    tryInitMimir();
  }, []);
}
