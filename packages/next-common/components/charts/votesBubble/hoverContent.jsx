import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import { useVotesBubbleView } from "next-common/components/detail/detailMultiTabs/votesBubbleViewTabs";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";

export default function VoteBubbleHoverContent({ node, sizeField }) {
  const chainSettings = useChainSettings();
  const chain = useChain();
  const hasLabel = ![Chains.kintsugi, Chains.interlay].includes(chain);
  const [view] = useVotesBubbleView();

  return (
    <ul>
      <li>
        <AddressUser
          add={node.data.account}
          ellipsis={false}
          className="text-textPrimaryContrast"
          noEvent
        />
      </li>
      {view === "flattened" && (
        <li>
          Capital:{" "}
          <ValueDisplay
            value={toPrecision(node.data.balance, chainSettings.decimals)}
            symbol={chainSettings.symbol}
          />
          {hasLabel && (
            <>
              (<VoteLabel {...node.data} />)
            </>
          )}
        </li>
      )}
      <li>
        Votes:{" "}
        <ValueDisplay
          value={toPrecision(node.data[sizeField], chainSettings.decimals)}
          symbol={chainSettings.symbol}
        />
      </li>
      {view === "nested" && (
        <li>Delegators: {node.data.directVoterDelegations?.length}</li>
      )}
    </ul>
  );
}
