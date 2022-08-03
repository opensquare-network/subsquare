import {
  DelegatingInfo,
  DelegatingValue,
} from "next-common/components/popup/styled";
import { toPrecision } from "next-common/utils";
import { convictionToLockX } from "utils/referendumUtil";

export default function Delegating({ addressVoteDelegate, node }) {
  const addressVoteDelegateBalance = addressVoteDelegate?.balance;
  const addressVoteDelegateConviction = addressVoteDelegate?.conviction;
  const addressVoteDelegateTarget = addressVoteDelegate?.target;

  return (
    <div>
      <DelegatingInfo>
        The address is set to proxy mode, the proxy address cannot vote
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
          <div className="proxy-label">Proxy</div>
          <a
            className="proxy-addr"
            href={`https://${node.value}.subscan.io/account/${addressVoteDelegateTarget}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${addressVoteDelegateTarget?.substr(
              0,
              4
            )}...${addressVoteDelegateTarget?.substr(
              addressVoteDelegateTarget?.length - 4
            )}`}
          </a>
        </div>
      </DelegatingValue>
    </div>
  );
}
