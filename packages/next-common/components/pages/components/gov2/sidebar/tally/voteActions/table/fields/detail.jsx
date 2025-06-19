import AddressUser from "next-common/components/user/addressUser";
import { cn } from "next-common/utils";
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

function DetailLabel({ className, children, width = "w-[120px]" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center text14Medium text-textTertiary",
        width,
        className,
      )}
    >
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

function DetailVoteValue({ balance, conviction }) {
  const { symbol, decimals } = useChainSettings();

  if (new BigNumber(balance).eq(0)) {
    return <span>-</span>;
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

  if (new BigNumber(value).eq(0)) {
    return <span>-</span>;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function VoteDetailRow({ label, children, labelWidth }) {
  return (
    <div className="flex flex-row max-md:justify-between">
      <DetailLabel width={labelWidth}>{label}</DetailLabel>
      {children}
    </div>
  );
}

function StandardVotesDetail({ data }) {
  if (!data?.isStandard) return null;

  const voteType = data?.vote?.vote?.isAye ? "aye" : "nay";

  return (
    <>
      <VoteDetailRow label={<VoteLabel type={voteType} />} />
      <VoteDetailRow label="self vote">
        <DetailVoteValue
          balance={data?.vote?.balance}
          conviction={data?.vote?.vote?.conviction}
        />
      </VoteDetailRow>
      <VoteDetailRow label="delegation">
        <CurrencyValue value={data?.delegations?.votes} />
      </VoteDetailRow>
    </>
  );
}

function SplitVotesDetail({ data }) {
  if (!data?.isSplit) return null;

  return (
    <>
      <VoteDetailRow label={<VoteLabel type="aye" />}>
        <CurrencyValue value={data?.vote?.aye} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="nay" />}>
        <CurrencyValue value={data?.vote?.nay} />
      </VoteDetailRow>
    </>
  );
}

function SplitAbstainVotesDetail({ data }) {
  if (!data?.isSplitAbstain) return null;

  return (
    <>
      <VoteDetailRow label={<VoteLabel type="aye" />}>
        <CurrencyValue value={data?.vote?.aye} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="nay" />}>
        <CurrencyValue value={data?.vote?.nay} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="abstain" />}>
        <CurrencyValue value={data?.vote?.abstain} />
      </VoteDetailRow>
    </>
  );
}

function VotesDetail({ data }) {
  const components = [
    <StandardVotesDetail key="standard" data={data} />,
    <SplitVotesDetail key="split" data={data} />,
    <SplitAbstainVotesDetail key="splitAbstain" data={data} />,
  ];

  return <>{components.filter(Boolean)}</>;
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
        <AddressUser key="user" add={data?.target} />
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
  }

  if (isDelegation(type)) {
    return <DelegationVoteDetail data={data} type={type} />;
  }

  return null;
}
