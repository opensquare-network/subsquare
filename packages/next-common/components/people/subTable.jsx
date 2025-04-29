import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import AddressDisplay from "next-common/components/user/addressDisplay";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemEdit2, SystemSubtract } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import { clearCachedIdentitys } from "next-common/services/identity";
import { useExtensionAccounts } from "../popupWithSigner/context";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";

const RemoveSubPopup = dynamicPopup(
  () => import("next-common/components/setSubsPopup/removePopup"),
  {
    ssr: false,
  },
);

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

export default function SubIdentitiesTable({
  subs = [],
  openSetSubsPopup = noop,
  isLoading,
}) {
  const chain = useChain();
  const { identity: identityChain } = getChainSettings(chain);
  const extensionAccounts = useExtensionAccounts();

  const [showRemoveSubPopup, setShowRemoveSubPopup] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState(-1);

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
    console.log("subs", subs);
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
            <AddressUser key={`Identity-${address}`} add={address} />,
            <div
              key={`Name-${index}`}
              className="text-textPrimary text14Medium"
            >
              {subName}
            </div>,
            <div
              key={`Address-${address}`}
              className="text-textTertiary text14Medium flex justify-between gap-x-2 items-center sm:ml-0 ml-4"
            >
              <AddressDisplay address={address} />
            </div>,
            <>
              <div className="flex items-center justify-end gap-x-2">
                <SecondaryButton className="w-7 h-7 !px-0 rounded">
                  <SystemEdit2 className="w-4 h-4" onClick={openSetSubsPopup} />
                </SecondaryButton>
                <SecondaryButton
                  className="w-7 h-7 !px-0 rounded"
                  onClick={() => {
                    setSelectedSub({ address, subName });
                    setSelectedSubIndex(index);
                    setShowRemoveSubPopup(true);
                  }}
                >
                  <SystemSubtract className="w-4 h-4" />
                </SecondaryButton>
              </div>
            </>,
          ];
        })}
        loading={isLoading && subs.length <= 0}
        noDataText="No sub identities"
      />
      {showRemoveSubPopup && (
        <RemoveSubPopup
          onClose={() => setShowRemoveSubPopup(false)}
          onSubmit={() => setShowRemoveSubPopup(false)}
          selectedSub={selectedSub}
          selectedSubIndex={selectedSubIndex}
          subs={subs}
        />
      )}
    </div>
  );
}
