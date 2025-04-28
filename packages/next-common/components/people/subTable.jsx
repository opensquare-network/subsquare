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

const SetSubsPopup = dynamicPopup(
  () => import("next-common/components/setSubsPopup"),
  {
    ssr: false,
  },
);

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
];

export default function SubIdentitiesTable({
  subs = [],
  retry = noop,
  isLoading,
}) {
  const chain = useChain();
  const { identity: identityChain } = getChainSettings(chain);
  const extensionAccounts = useExtensionAccounts();
  const [showSetSubsPopup, setShowSetSubsPopup] = useState(false);
  const [showRemoveSubPopup, setShowRemoveSubPopup] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState(-1);
  const [renderSubs, setRenderSubs] = useState([]);

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

    setRenderSubs([...subs]);
  }, [identityChain, extensionAccounts, subs]);

  return (
    <div className="flex flex-col gap-y-4">
      <DataList
        columns={columns}
        rows={(renderSubs ?? []).map(([address, subName], index) => {
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
              className="text-textTertiary text14Medium flex justify-between gap-x-2 items-start"
            >
              <AddressDisplay address={address} />

              <div className="flex items-center gap-x-2">
                <SecondaryButton className="w-7 h-7 !px-0 rounded">
                  <SystemEdit2
                    className="w-4 h-4"
                    onClick={() => setShowSetSubsPopup(true)}
                  />
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
            </div>,
          ];
        })}
        loading={isLoading}
        noDataText="No sub identities"
      />
      {showSetSubsPopup && (
        <SetSubsPopup
          onClose={() => setShowSetSubsPopup(false)}
          onSubmit={() => setShowSetSubsPopup(false)}
          subs={subs}
          retry={retry}
        />
      )}
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
