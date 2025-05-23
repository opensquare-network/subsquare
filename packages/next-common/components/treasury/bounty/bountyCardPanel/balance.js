import React from "react";
// import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
// import SymbolValue from "next-common/components/pages/components/gov2/sidebar/tally/values/symbolValue";

//TODO: show data
function Balance() {
  return (
    <span className="flex-1">
      <span className="flex flex-col">
        <span className="text-textTertiary text12Medium">Balance</span>
        <span className="mt-1"> 0 DOT</span>
        <span className="mt-1 text12Medium text-textTertiary"> $0 </span>
      </span>
    </span>
  );
}

export default React.memo(Balance);
