import AddressUser from "next-common/components/user/addressUser";
import ExplorerLink from "next-common/components/links/explorerLink";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import {
  SystemVoteAye,
  SystemVoteNay,
  SystemVoteAbstain,
} from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

const VOTE_ACTION_TYPES = {
  1: "Vote",
  2: "Remove Vote",
  3: "Delegate",
  4: "Remove Delegation",
};

const VOTE_TYPES = {
  STANDARD: "Standard",
  SPLIT: "Split",
  SPLIT_ABSTAIN: "SplitAbstain",
};

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

const VOTE_TYPE_CONFIG = {
  aye: { icon: SystemVoteAye, label: "Aye", color: "text-green-500" },
  nay: { icon: SystemVoteNay, label: "Nay", color: "text-red-500" },
  abstain: {
    icon: SystemVoteAbstain,
    label: "Abstain",
    color: "text-textTertiary",
  },
};

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

  if (balance === 0) {
    return <span>-</span>;
  }

  return (
    <div>
      <ValueDisplay value={toPrecision(balance, decimals)} symbol={symbol} />
      {conviction !== undefined && (
        <span className="text-textTertiary">
          *{conviction === 0 ? "0.1" : conviction}x
        </span>
      )}
    </div>
  );
}

function CurrencyValue({ value }) {
  const { symbol, decimals } = useChainSettings();

  if (Number(value) === 0) {
    return <span>-</span>;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function VoteDetailRow({ label, children, labelWidth }) {
  return (
    <div className="flex flex-row">
      <DetailLabel width={labelWidth}>{label}</DetailLabel>
      {children}
    </div>
  );
}

function ActionField({ type, indexer }) {
  return (
    <div className="flex flex-col">
      <div className="text-textPrimary text14Medium">
        {VOTE_ACTION_TYPES[type]}
      </div>
      <ExplorerLink indexer={indexer}>
        <div className="text-textTertiary hover:underline">
          <span>{formatDateTime(indexer?.blockTime)}</span>
          <span>&nbsp;↗</span>
        </div>
      </ExplorerLink>
    </div>
  );
}

function getVoteType(data) {
  if (data?.isStandard) {
    return VOTE_TYPES.STANDARD;
  }

  if (data?.isSplit) {
    return VOTE_TYPES.SPLIT;
  }

  if (data?.isSplitAbstain) {
    return VOTE_TYPES.SPLIT_ABSTAIN;
  }

  return null;
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

function DelegationVoteDetail() {
  // TODO: delegation data
  return null;
}

function VoteDetailField({ data, type }) {
  const isDirectVote = type === 1 || type === 2;
  const isDelegation = type === 3 || type === 4;

  if (isDirectVote) {
    return <DirectVoteDetail data={data} />;
  }

  if (isDelegation) {
    return <DelegationVoteDetail data={data} />;
  }

  return null;
}

export const columns = [
  {
    name: "Account",
    width: 224,
    render: ({ who }) => <AddressUser key="user" add={who} />,
  },
  {
    name: "Action",
    width: 200,
    className: "text-left",
    render: ({ type, indexer }) => (
      <ActionField type={type} indexer={indexer} />
    ),
  },
  {
    name: "Detail",
    width: 240,
    className: "text-left",
    render: ({ data, type }) => <VoteDetailField data={data} type={type} />,
  },
  {
    name: "Impact",
    width: 160,
    className: "text-right",
    render: () => <div>+ 600 VOTES</div>, // TODO: implement impact calculation
  },
];
