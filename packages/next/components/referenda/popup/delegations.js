import { DelegatingValue } from "next-common/components/popup/styled";
import { toPrecision } from "utils";
import PopupLabel from "next-common/components/popup/label";

export default function Delegations({ delegationsVotes, node }) {
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
