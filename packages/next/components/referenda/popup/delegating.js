import BigNumber from "bignumber.js";
import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  convictionToLockX,
  convictionToLockXNumber,
} from "next-common/utils/referendumCommon";
import tw from "tailwind-styled-components";
import ValueDisplay from "next-common/components/valueDisplay";

const DelegationInfoPanel = tw.div`
  flex
  flex-col
  rounded-[8px]
  bg-neutral200
  py-[10px]
  px-[16px]
  gap-[8px]
`;

const InfoList = tw.ul`
  flex
  flex-col
  gap-[4px]
`;

const InfoItem = tw.li`
  flex
  justify-between
  items-center
`;

const InfoItemName = tw.span`
  text-textSecondary
  text14Medium
`;

const InfoItemValue = tw.span`
  text-textPrimary
  text14Medium
`;

const Hint = tw.span`
  text12Medium
  text-textTertiary
`;

export default function Delegating({ addressVoteDelegate }) {
  const node = useChainSettings();
  const addressVoteDelegateBalance = addressVoteDelegate?.balance;
  const addressVoteDelegateConviction = addressVoteDelegate?.conviction;
  const addressVoteDelegateTarget = addressVoteDelegate?.target;

  const capital = toPrecision(addressVoteDelegateBalance, node.decimals);
  const votes = new BigNumber(capital)
    .times(convictionToLockXNumber(addressVoteDelegateConviction))
    .toString();

  return (
    <DelegationInfoPanel>
      <InfoList>
        <InfoItem>
          <InfoItemName>Delegated to</InfoItemName>
          <AddressUser add={addressVoteDelegateTarget} />
        </InfoItem>
        <InfoItem>
          <InfoItemName>Capital</InfoItemName>
          <InfoItemValue>
            <ValueDisplay
              showApproximationSymbol={false}
              value={capital}
              symbol={node.voteSymbol || node.symbol}
              showVerySmallNumber={true}
              className="text-textPrimary text14Medium"
            />
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemName>Conviction</InfoItemName>
          <InfoItemValue>
            {convictionToLockX(addressVoteDelegateConviction)}
          </InfoItemValue>
        </InfoItem>
        <InfoItem>
          <InfoItemName>Votes</InfoItemName>
          <InfoItemValue>
            <ValueDisplay
              showApproximationSymbol={false}
              value={votes}
              symbol={node.voteSymbol || node.symbol}
              showVerySmallNumber={true}
              className="text-textPrimary text14Medium"
            />
          </InfoItemValue>
        </InfoItem>
      </InfoList>
      <Hint>Delegation votes can not be voted directly.</Hint>
    </DelegationInfoPanel>
  );
}
