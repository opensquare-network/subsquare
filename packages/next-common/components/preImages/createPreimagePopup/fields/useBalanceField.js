import BalanceField from "next-common/components/popup/fields/balanceField";
import { useState } from "react";

export default function useBalanceField() {
  const [inputBalance, setInputBalance] = useState("");

  return {
    value: inputBalance,
    component: (
      <BalanceField
        title="Request"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
    ),
  };
}
