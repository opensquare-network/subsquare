import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import AddressDisplay from "next-common/components/user/addressDisplay";
import { useEffect } from "react";
import { useChain } from "next-common/context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import { clearCachedIdentitys } from "next-common/services/identity";
import { useExtensionAccounts } from "../popupWithSigner/context";
import { cn } from "next-common/utils";

const columns = [
  {
    name: "Identity",
    width: 240,
  },
  {
    name: "Name",
    width: 240,
  },
  {
    name: "Address",
  },
];

export default function SubIdentitiesTable({ subs = [], isLoading }) {
  const chain = useChain();
  const { identity: identityChain } = getChainSettings(chain);
  const extensionAccounts = useExtensionAccounts();

  useEffect(() => {
    if (extensionAccounts?.length) {
      clearCachedIdentitys(
        extensionAccounts.map(({ address }) => ({
          chain: identityChain,
          address,
        })),
        true,
      );
    }
  }, [identityChain, extensionAccounts, subs]);

  return (
    <div
      className={cn("flex flex-col gap-y-4", {
        "border-b border-neutral300": subs?.length === 0,
      })}
    >
      <DataList
        columns={columns}
        rows={(subs ?? []).map(([address, subName], index) => {
          return [
            <AddressUser key={`Identity-${index}`} add={address} />,
            <div
              key={`Name-${index}`}
              className="text-textPrimary text14Medium"
            >
              {subName}
            </div>,
            <div
              key={`Address-${index}`}
              className="text-textTertiary text14Medium flex justify-between gap-x-2 items-center sm:ml-0 ml-4"
            >
              <AddressDisplay address={address} />
            </div>,
          ];
        })}
        loading={isLoading && subs.length <= 0}
        noDataText="No sub identities"
      />
    </div>
  );
}
