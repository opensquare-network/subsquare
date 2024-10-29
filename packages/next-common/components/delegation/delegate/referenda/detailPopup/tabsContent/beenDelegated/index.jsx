import { SystemMenu } from "@osn/icons/subsquare";
import DataList from "next-common/components/dataList";
import Popup from "next-common/components/popup/wrapper/Popup";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import { toPrecision } from "next-common/utils";
import { useMaybeServerAllBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import { useState } from "react";
import ReferendaDelegateeDetailPopupBeenDelegatedInfo from "./info";
import DelegatorList from "./delegatorList";

export default function ReferendaDelegateeDetailPopupBeenDelegated({
  delegate,
}) {
  const { symbol, decimals } = useChainSettings();
  const { isLoading, beenDelegatedList } = useMaybeServerAllBeenDelegatedList(
    delegate.address,
  );

  const [beenDelegatedPopup, setBeenDelegatedPopup] = useState(false);
  const [beenDelegatedPopupData, setBeenDelegatedPopupData] = useState([]);

  const columns = [
    {
      name: "Track",
      width: 190,
    },
    {
      name: "Delegators",
      className: "text-right",
      width: 160,
    },
    {
      name: "Capital",
      className: "text-right",
      width: 160,
    },
    {
      name: "Votes",
      className: "text-right",
      width: 160,
    },
    {
      name: "",
      className: "text-right",
      width: 80,
    },
  ];

  const rows = beenDelegatedList?.map?.((item) => {
    return [
      <Track key={"track"} id={item?.track?.id} />,
      item.beenDelegated?.length,
      <ValueDisplay
        key={"capital"}
        symbol={symbol}
        value={toPrecision(item?.totalBalance, decimals)}
      />,
      <ValueDisplay
        key={"votes"}
        symbol={symbol}
        value={toPrecision(item?.totalVotes, decimals)}
      />,
      <SecondaryButton
        key={"detail"}
        size="small"
        className="w-7 p-0"
        onClick={() => {
          setBeenDelegatedPopup(true);
          setBeenDelegatedPopupData(item);
        }}
      >
        <SystemMenu className="w-4 h-4" />
      </SecondaryButton>,
    ];
  });

  return (
    <>
      <DataList
        loading={isLoading}
        columns={columns}
        rows={rows}
        noDataText="No been delegated"
      />

      {beenDelegatedPopup && (
        <Popup
          title="Been Delegated"
          className="w-[640px] max-w-full"
          onClose={() => {
            setBeenDelegatedPopup(false);
            setBeenDelegatedPopupData([]);
          }}
        >
          <ReferendaDelegateeDetailPopupBeenDelegatedInfo
            delegate={beenDelegatedPopupData}
          />

          <DelegatorList delegators={beenDelegatedPopupData.beenDelegated} />
        </Popup>
      )}
    </>
  );
}
