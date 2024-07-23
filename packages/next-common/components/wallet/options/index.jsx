import { noop } from "lodash-es";
import { useEffect, useState } from "react";
import WalletSubstrateOptions from "./substrate";
import WalletEVMOptions from "./evm";

export default function WalletOptions({ onSelect = noop }) {
  const [view, setView] = useState("substrate");
  const [selectedWallet, setSelectedWallet] = useState();

  useEffect(() => {
    onSelect(selectedWallet);
  }, [selectedWallet]);

  useEffect(() => {
    return () => {
      setView("substrate");
    };
  }, []);

  function handleOnSelect(wallet) {
    setSelectedWallet(wallet);
  }

  const isSubstrate = view === "substrate";
  const isEVM = view === "evm";

  return (
    <div className="space-y-6">
      {isSubstrate && (
        <WalletSubstrateOptions
          selectedWallet={selectedWallet}
          onSelect={handleOnSelect}
          setView={setView}
        />
      )}

      {isEVM && (
        <WalletEVMOptions
          selectedWallet={selectedWallet}
          onSelect={handleOnSelect}
          setView={setView}
        />
      )}
    </div>
  );
}
