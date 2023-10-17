import { ListCard } from "../../../styled";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import { useSelector } from "react-redux";
import { isLoadingReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import priorColumns from "./columns";
import myFilteredReferendaPriorLocksSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/priors";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Expiration from "./expiration";
import HintMessage from "next-common/components/styled/hintMessage";
import Track from "next-common/components/referenda/track/trackTag";

export default function PriorLocks() {
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  const filteredLocks = useSelector(myFilteredReferendaPriorLocksSelector);
  const { symbol, decimals } = useChainSettings();

  const rows = filteredLocks.map((item, index) => {
    return {
      useData: () => {
        const row = [
          <Track key="track" id={item.trackId} />,
          <ValueDisplay
            key="balance"
            value={toPrecision(item.balance, decimals)}
            symbol={symbol}
          />,
          <Expiration key="expiration" unlockAt={item.unlockAt} />,
        ];

        row.key = index;
        return row;
      },
    };
  });

  return (
    <ListCard>
      <HintMessage style={{ marginBottom: 24 }}>
        Prior locks are due to previous removed votes.
      </HintMessage>
      <ScrollerX>
        <NoBorderList
          isLoading={isLoading}
          columns={priorColumns}
          rows={rows}
          noDataText="No locks"
        />
      </ScrollerX>
    </ListCard>
  );
}
