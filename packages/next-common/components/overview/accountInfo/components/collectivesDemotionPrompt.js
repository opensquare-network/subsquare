import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import { useAmbassadorMemberData } from "../context/ambassadorMemberDataContext";
import { useFellowshipMemberData } from "../context/fellowshipMemberDataContext";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import Link from "next/link";
import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";

function DemotionExpiredMessage({ section, rank }) {
  let cacheKey;
  if (section === "fellowship") {
    cacheKey = CACHE_KEY.fellowshipDemotionExpiredVisible;
  } else if (section === "ambassador") {
    cacheKey = CACHE_KEY.ambassadorDemotionExpiredVisible;
  } else {
    return null;
  }

  return (
    <Prompt cacheKey={cacheKey} type={PromptTypes.ERROR}>
      The {rank === 0 ? "offboard" : "demotion"} period of {section} member is
      expired. Check more details{" "}
      <Link className="underline" href={`/${section}/core`}>
        here
      </Link>
    </Prompt>
  );
}

function DemotionAboutToExpireMessage({ section, rank }) {
  let cacheKey;
  if (section === "fellowship") {
    cacheKey = CACHE_KEY.fellowshipDemotionExpireRemindVisible;
  } else if (section === "ambassador") {
    cacheKey = CACHE_KEY.ambassadorDemotionExpireRemindVisible;
  } else {
    return null;
  }

  return (
    <Prompt cacheKey={cacheKey} type={PromptTypes.WARNING}>
      The {rank === 0 ? "offboard" : "demotion"} period of {section} member is
      about to expire. Check more details{" "}
      <Link className="underline" href={`/${section}/core`}>
        here
      </Link>
    </Prompt>
  );
}

function DemotionPrompt({ section, lastProof, rank, params }) {
  const blockTime = useSelector(blockTimeSelector);
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });

  const isDemotionExpired = percentageValue === 100;
  const daysRemaining = new BigNumber(blockTime)
    .multipliedBy(remainingBlocks)
    .div(86400 * 1000)
    .toNumber();

  if (isDemotionExpired) {
    return <DemotionExpiredMessage section={section} rank={rank} />;
  }

  if (demotionPeriod > 0 && daysRemaining < 28) {
    return <DemotionAboutToExpireMessage section={section} rank={rank} />;
  }
}

function FellowshipDemotionPrompt() {
  const { data, isLoading } = useFellowshipMemberData();

  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <DemotionPrompt
      section="fellowship"
      lastProof={coreMember?.lastProof}
      rank={collectiveMember?.rank}
      params={coreParams}
    />
  );
}

function AmbassadorDemotionPrompt() {
  const { data, isLoading } = useAmbassadorMemberData();

  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <DemotionPrompt
      section="ambassador"
      lastProof={coreMember?.lastProof}
      rank={collectiveMember?.rank}
      params={coreParams}
    />
  );
}

export default function CollectivesDemotionPrompt() {
  return (
    <>
      <FellowshipDemotionPrompt />
      <AmbassadorDemotionPrompt />
    </>
  );
}
