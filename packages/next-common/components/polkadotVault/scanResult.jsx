import { SystemTrash } from "@osn/icons/subsquare";
import { WalletGroupTitle } from "next-common/components/wallet/options/styled";
import Avatar from "next-common/components/avatar";
import Button from "next-common/lib/button";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import WalletTypes from "next-common/utils/consts/walletTypes";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import { cn } from "next-common/utils";

export default function ScanResult() {
  const [web3Login, web3Loading] = useWeb3Login();
  const [selectedAccount, setSelectedAccount] = useState();
  const { removeAccount } = usePolkadotVaultAccounts();

  const { accounts } = usePolkadotVaultAccounts();
  if (!accounts.length) {
    return;
  }

  return (
    <div className=" space-y-2">
      <WalletGroupTitle>Select Your Scan Result</WalletGroupTitle>
      {accounts?.map((item) => (
        <Item
          item={item}
          key={item.address}
          isSelected={item.address === selectedAccount}
          onClick={(address) => {
            setSelectedAccount(address);
          }}
          onDelete={(address) => {
            if (address === selectedAccount) {
              setSelectedAccount("");
            }
            removeAccount(address);
          }}
        />
      ))}
      {selectedAccount && (
        <div className="mt-3">
          <PrimaryButton
            className="w-full"
            onClick={() => {
              web3Login({
                account: { address: selectedAccount },
                wallet: WalletTypes.POLKADOT_VAULT,
              });
            }}
            disabled={web3Loading}
          >
            Next
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

function Item({ item, onClick, onDelete, isSelected }) {
  return (
    <div
      key={item.address}
      className={cn(
        "h-16 justify-between pl-3 pr-2.5 border border-neutral400 rounded-lg p-2 border-b flex items-center gap-3",
        isSelected && " bg-neutral200",
      )}
    >
      <div
        className="flex gap-1 cursor-pointer"
        onClick={() => {
          onClick(item.address);
        }}
      >
        <Avatar size={40} address={item.address} />
        <div className="text-textPrimary text14Medium">
          <div className="text14Medium text-textPrimary">{item.name}</div>
          <div className="break-all text-textTertiary text12Medium inline-flex items-center">
            {item.address}
          </div>
        </div>
      </div>
      <Button>
        <SystemTrash
          onClick={() => {
            onDelete(item.address);
          }}
        />
      </Button>
    </div>
  );
}
