import {
  DelegatingInfo,
  DelegatingValue,
} from "next-common/components/popup/styled";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { convictionToLockX } from "utils/referendumUtil";

export default function Delegating({ addressVoteDelegate }) {
  const node = useChainSettings();
  const addressVoteDelegateBalance = addressVoteDelegate?.balance;
  const addressVoteDelegateConviction = addressVoteDelegate?.conviction;
  const addressVoteDelegateTarget = addressVoteDelegate?.target;
  const shortAddr = `${addressVoteDelegateTarget?.substr(
    0,
    4
  )}...${addressVoteDelegateTarget?.substr(
    addressVoteDelegateTarget?.length - 4
  )}`;

  return (
    <div>
      <DelegatingInfo>
        This address is delegating to {shortAddr}, and it can not vote directly.
      </DelegatingInfo>
      <DelegatingValue>
        <div className="vote">
          <div className="balance">
            {toPrecision(addressVoteDelegateBalance, node.decimals)}{" "}
            {node.voteSymbol || node.symbol}
          </div>
          <div className="conviction">
            {convictionToLockX(addressVoteDelegateConviction)}
          </div>
        </div>
        <div className="proxy">
          <div className="proxy-label">Delegation</div>
          <a
            className="proxy-addr"
            href={`https://${node.value}.subscan.io/account/${addressVoteDelegateTarget}`}
            target="_blank"
            rel="noreferrer"
          >
            {shortAddr}
          </a>
        </div>
      </DelegatingValue>
    </div>
  );
}
