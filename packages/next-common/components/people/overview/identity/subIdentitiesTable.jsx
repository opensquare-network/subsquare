import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import AddressDisplay from "next-common/components/user/addressDisplay";
import { useEffect, useCallback } from "react";
import { useChain } from "next-common/context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import { clearCachedIdentitys } from "next-common/services/identity";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import SubIdentityActions from "next-common/components/people/overview/identity/subIdentityActions";

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
  {
    name: "",
    width: 80,
  },
];

export function SubIdentitiesTableImpl({ subs = [], isLoading, onSuccess }) {
  return (
    <DataList
      columns={columns}
      rows={(subs ?? []).map(([address, subName], index) => {
        return [
          <AddressUser key={`Identity-${index}`} add={address} />,
          <div key={`Name-${index}`} className="text-textPrimary text14Medium">
            <Tooltip content={subName} className="inline-flex items-center">
              <span className="max-w-[220px] truncate inline-block">
                {subName}
              </span>
            </Tooltip>
          </div>,
          <div
            key={`Address-${index}`}
            className="text-textTertiary text14Medium flex justify-between gap-x-2 items-center sm:ml-0 ml-4"
          >
            <AddressDisplay address={address} />
          </div>,
          <SubIdentityActions
            key={`Actions-${address}`}
            address={address}
            currentName={subName}
            onSuccess={onSuccess}
          />,
        ];
      })}
      loading={isLoading && subs.length <= 0}
      noDataText="No sub identities"
    />
  );
}

export default function SubIdentitiesTable({ subs = [], isLoading, retry }) {
  const chain = useChain();
  const { identity: identityChain } = getChainSettings(chain);
  const extensionAccounts = useExtensionAccounts();

  const handleSuccess = useCallback(() => {
    if (extensionAccounts?.length) {
      clearCachedIdentitys(
        extensionAccounts.map(({ address }) => ({
          chain: identityChain,
          address,
        })),
        true,
      );
    }
    retry?.();
  }, [identityChain, extensionAccounts, retry]);

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
      <SubIdentitiesTableImpl
        subs={subs}
        isLoading={isLoading}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
