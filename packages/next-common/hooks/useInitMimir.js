import { tryInitMimir } from "next-common/utils/sendTransaction/sendMimirTx";
import { useEffect } from "react";

export default function useInitMimir() {
  useEffect(() => {
    tryInitMimir();
  }, []);
}
