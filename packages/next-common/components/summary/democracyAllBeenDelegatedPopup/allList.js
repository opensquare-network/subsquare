import { noop } from "lodash-es";
import styled from "styled-components";
import PopupListWrapper from "../../styled/popupListWrapper";
import ValueDisplay from "../../valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import DataList from "next-common/components/dataList";

const TrackItemWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`;

export default function AllBeenDelegatedPopupAllList({
  beenDelegatedList,
  onTrackClick = noop,
}) {
  const { symbol, decimals } = useChainSettings();

  const colWidths = {
    track: 434,
    votes: 128,
  };

  const columns = [
    {
      name: "TRACK",
      style: { textAlign: "left", width: colWidths.track },
    },
    {
      name: "VOTES",
      style: { textAlign: "right", width: colWidths.votes },
    },
  ];

  const rows = beenDelegatedList?.map?.((item) => {
    const row = [
      <TrackItemWrapper key="track" onClick={() => onTrackClick(item.track.id)}>
        <Gov2TrackTag name={item.track.name} id={item.track.id}></Gov2TrackTag>
      </TrackItemWrapper>,
      <ValueDisplay
        key="votes"
        value={toPrecision(item.totalVotes, decimals)}
        symbol={symbol}
      />,
    ];
    return row;
  });

  return (
    <PopupListWrapper>
      <DataList
        columns={columns}
        rows={rows}
        noDataText="No current delegations"
      />
    </PopupListWrapper>
  );
}
