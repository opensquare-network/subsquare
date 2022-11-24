import { DelegatingValue } from "next-common/components/popup/styled";
import { toPrecision } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import { useChainSettings } from "next-common/context/chain";

export default function Delegations({ delegationsVotes }) {
  const node = useChainSettings();
  return (
    <div>
      <PopupLabel
        text={"Total Proxy Value"}
        tooltip={"Voting value for all proxy addresses"}
      />
      <DelegatingValue>
        <div className="vote">
          <div className="balance">
            {toPrecision(delegationsVotes, node.decimals)}{" "}
            {node.voteSymbol || node.symbol}
          </div>
        </div>
      </DelegatingValue>
    </div>
  );
}
