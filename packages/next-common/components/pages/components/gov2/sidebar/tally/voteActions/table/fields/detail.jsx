import { useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import BigNumber from "bignumber.js";
import {
  VOTE_TYPE_CONFIG,
  isDirectVote,
  isDelegation,
  getVoteType,
} from "../common";

function DetailLabel({ children }) {
  return (
    <div className="inline-flex items-center text14Medium text-textTertiary w-[120px]">
      {children}
    </div>
  );
}

function VoteLabel({ type }) {
  const voteConfig = VOTE_TYPE_CONFIG[type];
  if (!voteConfig) {
    return null;
  }

  const { icon: Icon, color } = voteConfig;
  return (
    <DetailLabel>
      <Icon className="w-4 h-4 mr-2" />
      <span className={color}>{voteConfig.label}</span>
    </DetailLabel>
  );
}

function useIsZeroValue(value) {
  return useMemo(() => new BigNumber(value).eq(0), [value]);
}

function DetailVoteValue({ balance, conviction }) {
  const { symbol, decimals } = useChainSettings();
  const isZero = useIsZeroValue(balance);

  if (isZero) {
    return 0;
  }

  return (
    <div>
      <ValueDisplay value={toPrecision(balance, decimals)} symbol={symbol} />
      {conviction !== undefined && (
        <span className="text-textTertiary">
          *{convictionToLockX(conviction)}
        </span>
      )}
    </div>
  );
}

function CurrencyValue({ value }) {
  const { symbol, decimals } = useChainSettings();
  const isZero = useIsZeroValue(value);

  if (isZero) {
    return 0;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function VoteDetailRow({ label, children }) {
  return (
    <div className="flex flex-row max-md:justify-between">
      <DetailLabel>{label}</DetailLabel>
      {children}
    </div>
  );
}

function StandardVotesDetail({ data }) {
  const voteType = data?.vote?.vote?.vote?.isAye ? "aye" : "nay";

  return (
    <>
      <VoteDetailRow label={<VoteLabel type={voteType} />} />
      <VoteDetailRow label="self vote">
        <DetailVoteValue
          balance={data?.vote?.vote?.balance}
          conviction={data?.vote?.vote?.vote?.conviction}
        />
      </VoteDetailRow>
      <VoteDetailRow label="delegation">
        <CurrencyValue value={data?.delegations?.votes} />
      </VoteDetailRow>
    </>
  );
}

function SplitVotesDetail({ data }) {
  return (
    <>
      <VoteDetailRow label={<VoteLabel type="aye" />}>
        <CurrencyValue value={data?.vote?.vote?.aye} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="nay" />}>
        <CurrencyValue value={data?.vote?.vote?.nay} />
      </VoteDetailRow>
    </>
  );
}

function SplitAbstainVotesDetail({ data }) {
  return (
    <>
      <VoteDetailRow label={<VoteLabel type="aye" />}>
        <CurrencyValue value={data?.vote?.vote?.aye} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="nay" />}>
        <CurrencyValue value={data?.vote?.vote?.nay} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="abstain" />}>
        <CurrencyValue value={data?.vote?.vote?.abstain} />
      </VoteDetailRow>
    </>
  );
}

function VotesDetail({ data }) {
  if (!data) return null;

  if (data.vote?.isStandard) {
    return <StandardVotesDetail data={data} />;
  } else if (data.vote?.isSplit) {
    return <SplitVotesDetail data={data} />;
  } else if (data.vote?.isSplitAbstain) {
    return <SplitAbstainVotesDetail data={data} />;
  }

  return null;
}

function DirectVoteDetail({ data }) {
  return (
    <div className="flex flex-col">
      <VoteDetailRow label="vote type">
        <span>{getVoteType(data)}</span>
      </VoteDetailRow>
      <VotesDetail data={data} />
    </div>
  );
}

function DelegationVoteDetail({ data, type }) {
  return (
    <div className="flex flex-col">
      <VoteDetailRow label={<span>{type === 3 ? "to" : "from"}</span>}>
        <AddressUser key="user" add={data?.target} showAvatar={false} />
      </VoteDetailRow>
      <VoteDetailRow label={<span>votes</span>}>
        <DetailVoteValue
          balance={data?.delegation?.balance}
          conviction={data?.delegation?.conviction}
        />
      </VoteDetailRow>
    </div>
  );
}

export default function VoteDetailField({ data, type }) {
  if (isDirectVote(type)) {
    return <DirectVoteDetail data={data} />;
  } else if (isDelegation(type)) {
    return <DelegationVoteDetail data={data} type={type} />;
  }

  return null;
}
