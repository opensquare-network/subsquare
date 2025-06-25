import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import {
  VOTE_TYPE_CONFIG,
  isDirectVote,
  isDelegation,
  getVoteType,
  getVoteBalance,
  getVoteConviction,
  isAyeVote,
  VOTE_LABELS,
} from "../../common";
import { cn } from "next-common/utils";

function DetailLabel({ children }) {
  return (
    <div className="inline-flex items-center text14Medium text-textTertiary">
      {children}&nbsp;
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

function CurrencyValue({ balance }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <ValueDisplay
      value={toPrecision(balance, decimals)}
      symbol={symbol}
      className="text14Medium"
    />
  );
}

function DetailVoteValue({ balance, conviction }) {
  return (
    <div>
      <span>(</span>
      <CurrencyValue balance={balance} />
      {conviction !== undefined && (
        <span className="text-textTertiary">
          *{convictionToLockX(conviction)}
        </span>
      )}
      <span>)</span>
    </div>
  );
}

function VoteDetailRow({ label, children }) {
  return (
    <div className="flex flex-row max-md:justify-end">
      <DetailLabel>{label}</DetailLabel>
      {children}
    </div>
  );
}

function ChangeVoteWrapper({ pre, current, className }) {
  return (
    <div
      className={cn("max-md:flex max-md:flex-col max-md:items-end", className)}
    >
      {pre}
      <span className="text14Medium text-textTertiary">→</span>
      {current}
    </div>
  );
}

function StandardVoteRow({ voteData, delegations }) {
  const voteType = isAyeVote(voteData) ? "aye" : "nay";

  return (
    <>
      <VoteDetailRow label={<VoteLabel type={voteType} />}>
        <DetailVoteValue
          balance={getVoteBalance(voteData)}
          conviction={getVoteConviction(voteData)}
        />
      </VoteDetailRow>
      <VoteDetailRow label={VOTE_LABELS.DELEGATIONS}>
        <CurrencyValue balance={delegations} />
      </VoteDetailRow>
    </>
  );
}

function SplitVoteRow({ voteData }) {
  return (
    <>
      <VoteDetailRow label={<VoteLabel type="aye" />}>
        <DetailVoteValue balance={voteData?.vote?.aye} />
      </VoteDetailRow>
      <VoteDetailRow label={<VoteLabel type="nay" />}>
        <DetailVoteValue balance={voteData?.vote?.nay} />
      </VoteDetailRow>
    </>
  );
}

function SplitAbstainVoteRow({ voteData }) {
  return (
    <>
      <SplitVoteRow voteData={voteData} />
      <VoteDetailRow label={<VoteLabel type="abstain" />}>
        <DetailVoteValue balance={voteData?.vote?.abstain} />
      </VoteDetailRow>
    </>
  );
}

function VoteRows({ data, voteKey = "vote" }) {
  const voteData = data?.[voteKey];

  if (!voteData) {
    return null;
  }

  if (voteData.isStandard) {
    return (
      <StandardVoteRow
        voteData={voteData}
        delegations={data?.delegations?.votes}
      />
    );
  }

  if (voteData.isSplit) {
    return <SplitVoteRow voteData={voteData} />;
  }

  if (voteData.isSplitAbstain) {
    return <SplitAbstainVoteRow voteData={voteData} />;
  }

  return null;
}

function DelegationTargetRow({ data, type }) {
  return (
    <VoteDetailRow
      label={<span>{type === 3 ? VOTE_LABELS.TO : VOTE_LABELS.FROM}</span>}
    >
      <AddressUser key="user" add={data?.target} showAvatar={false} />
    </VoteDetailRow>
  );
}

function DelegationVotesRow({
  delegationData,
  showChange = false,
  preDelegationData = null,
}) {
  const current = (
    <DetailVoteValue
      balance={delegationData?.balance}
      conviction={delegationData?.conviction}
    />
  );

  if (!showChange || !preDelegationData) {
    return (
      <VoteDetailRow label={<span>{VOTE_LABELS.VOTES}</span>}>
        {current}
      </VoteDetailRow>
    );
  }

  const pre = (
    <DetailVoteValue
      balance={preDelegationData?.balance}
      conviction={preDelegationData?.conviction}
    />
  );

  return (
    <ChangeVoteWrapper
      pre={
        <VoteDetailRow label={<span>{VOTE_LABELS.VOTES}</span>}>
          {pre}
        </VoteDetailRow>
      }
      current={
        <ResponsiveWrapper
          desktop={current}
          mobile={
            <VoteDetailRow label={<span>{VOTE_LABELS.VOTES}</span>}>
              {current}
            </VoteDetailRow>
          }
        />
      }
      className="inline-flex"
    />
  );
}

function VoteChangeRows({
  data,
  preVoteKey = "preVote",
  currentVoteKey = "vote",
}) {
  const preVote = data?.[preVoteKey];
  const currentVote = data?.[currentVoteKey];

  if (!preVote || !currentVote) {
    return null;
  }

  if (preVote.isStandard && currentVote.isStandard) {
    return <StandardVoteChangeRows data={data} />;
  }

  if (preVote.isSplit && currentVote.isSplit) {
    return <SplitVoteChangeRows data={data} />;
  }

  if (preVote.isSplitAbstain && currentVote.isSplitAbstain) {
    return <SplitAbstainVoteChangeRows data={data} />;
  }

  return <MixedVoteChangeRows data={data} />;
}

function VoteType({ type }) {
  return (
    <p className="inline-flex max-md:justify-end text-textTertiary text12Medium">
      <span>{VOTE_LABELS.VOTE_TYPE}</span>
      <span>{getVoteType(type)}</span>
    </p>
  );
}

function StandardVoteChangeRows({ data }) {
  const preVoteType = data?.preVote?.vote?.vote?.isAye ? "aye" : "nay";
  const currentVoteType = data?.vote?.vote?.vote?.isAye ? "aye" : "nay";

  const pre = (
    <VoteDetailRow label={<VoteLabel type={preVoteType} />}>
      <DetailVoteValue
        balance={data?.preVote?.vote?.balance}
        conviction={data?.preVote?.vote?.vote?.conviction}
      />
    </VoteDetailRow>
  );

  const current = (
    <VoteDetailRow label={<VoteLabel type={currentVoteType} />}>
      <DetailVoteValue
        balance={data?.vote?.vote?.balance}
        conviction={data?.vote?.vote?.vote?.conviction}
      />
    </VoteDetailRow>
  );

  return (
    <>
      <ChangeVoteWrapper pre={pre} current={current} />
      <VoteDetailRow label={VOTE_LABELS.DELEGATIONS}>
        <CurrencyValue balance={data?.delegations?.votes} />
      </VoteDetailRow>
      <VoteType type={data?.vote} />
    </>
  );
}

const createSplitVoteRow = (type, preBalance, currentBalance) => {
  const pre = (
    <VoteDetailRow label={<VoteLabel type={type} />}>
      <DetailVoteValue balance={preBalance} />
    </VoteDetailRow>
  );

  const current = <DetailVoteValue balance={currentBalance} />;

  return (
    <ChangeVoteWrapper pre={pre} current={current} className="inline-flex" />
  );
};

function ResponsiveWrapper({ desktop, mobile }) {
  return (
    <>
      <div className="flex flex-col max-md:hidden">{desktop}</div>
      <div className="hidden max-md:flex flex-col">{mobile}</div>
    </>
  );
}

function SplitVoteChangeRows({ data }) {
  const desktopContent = (
    <>
      {createSplitVoteRow(
        "aye",
        data?.preVote?.vote?.vote?.aye,
        data?.vote?.vote?.aye,
      )}
      {createSplitVoteRow(
        "nay",
        data?.preVote?.vote?.nay,
        data?.vote?.vote?.nay,
      )}
    </>
  );

  const mobileContent = (
    <ChangeVoteWrapper
      pre={<SplitVoteRow voteData={data?.preVote} />}
      current={<SplitVoteRow voteData={data?.vote} />}
      className="inline-flex"
    />
  );

  return (
    <>
      <ResponsiveWrapper desktop={desktopContent} mobile={mobileContent} />
      <VoteType type={data?.vote} />
    </>
  );
}

function SplitAbstainVoteChangeRows({ data }) {
  const desktopContent = (
    <>
      {createSplitVoteRow(
        "aye",
        data?.preVote?.vote?.aye,
        data?.vote?.vote?.aye,
      )}
      {createSplitVoteRow(
        "nay",
        data?.preVote?.vote?.nay,
        data?.vote?.vote?.nay,
      )}
      {createSplitVoteRow(
        "abstain",
        data?.preVote?.vote?.abstain,
        data?.vote?.vote?.abstain,
      )}
    </>
  );

  const mobileContent = (
    <ChangeVoteWrapper
      pre={<SplitAbstainVoteRow voteData={data?.preVote} />}
      current={<SplitAbstainVoteRow voteData={data?.vote} />}
      className="inline-flex"
    />
  );

  return (
    <>
      <ResponsiveWrapper desktop={desktopContent} mobile={mobileContent} />
      <VoteType type={data?.vote} />
    </>
  );
}

function DirectVoteDetail({ data, voteKey = "vote" }) {
  return (
    <div className="flex flex-col">
      <VoteRows data={data} voteKey={voteKey} />
      <VoteType type={data?.[voteKey]} />
    </div>
  );
}

function MixedVoteChangeRows({ data }) {
  const pre = <DirectVoteDetail data={data} voteKey="preVote" />;
  const current = <DirectVoteDetail data={data} voteKey="vote" />;

  return <ChangeVoteWrapper pre={pre} current={current} />;
}

function DelegationDetail({ data, type }) {
  return (
    <div className="flex flex-col">
      <DelegationTargetRow data={data} type={type} />
      <DelegationVotesRow delegationData={data?.delegation} />
    </div>
  );
}

function DirectVoteChangeDetail({ data }) {
  return (
    <div className="flex flex-col">
      <VoteChangeRows data={data} />
    </div>
  );
}

function DelegationChangeDetail({ data, type }) {
  return (
    <div className="flex flex-col">
      <DelegationTargetRow data={data} type={type} />
      <DelegationVotesRow
        delegationData={data?.delegation}
        showChange={true}
        preDelegationData={data?.preDelegation}
      />
    </div>
  );
}

export default function VoteDetailField({ data, type }) {
  if (isDirectVote(type)) {
    if (data?.preVote) {
      return <DirectVoteChangeDetail data={data} />;
    }

    return <DirectVoteDetail data={data} />;
  }

  if (isDelegation(type)) {
    if (data?.preDelegation) {
      return <DelegationChangeDetail data={data} type={type} />;
    }

    return <DelegationDetail data={data} type={type} />;
  }

  return null;
}
