import { isAddress } from "@polkadot/util-crypto";
import { useState } from "react";
import Input from "next-common/lib/input";
import PrimaryButton from "next-common/lib/button/primary";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import WalletTypes from "next-common/utils/consts/walletTypes";

export default function WatchOnlyAddressForm({
  buttonText = "Next",
  onConnected,
}) {
  const chain = useChain();
  const [web3Login, web3Loading] = useWeb3Login();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const onConfirm = async () => {
    const input = address.trim();

    if (!input) {
      setError("Please fill an address");
      return;
    }

    if (!isAddress(input)) {
      setError("Invalid address");
      return;
    }

    setError("");
    await web3Login({
      account: { address: encodeAddressToChain(input, chain) },
      wallet: WalletTypes.WATCH_ONLY,
    });
    onConnected?.();
  };

  return (
    <div className="space-y-3">
      <div>
        <Input
          placeholder="Please fill the address to watch"
          value={address}
          error={error}
          onChange={(e) => {
            setAddress(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm();
            }
          }}
        />
      </div>
      <PrimaryButton
        className="w-full"
        onClick={onConfirm}
        loading={web3Loading}
      >
        {buttonText}
      </PrimaryButton>
    </div>
  );
}
