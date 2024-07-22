import { useCallback, useEffect, useState } from "react";
import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { TotalBalance, Transferrable } from "./accountBalances";
import SummaryItem from "next-common/components/summary/layout/item";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import { useRemainingTime } from "next-common/components/remaining";
import { usePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CollectivesProvider, {
  useCollectivesContext,
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { cn } from "next-common/utils";
import { useDispatch } from "react-redux";
import {
  setAmbassadorDemotionExpired,
  setAmbassadorDemotionExpireRemind,
  setAmbassadorOffboardExpired,
  setAmbassadorOffboardExpireRemind,
  setAmbassadorPromotable,
  setFellowshipDemotionExpired,
  setFellowshipDemotionExpireRemind,
  setFellowshipOffboardExpired,
  setFellowshipOffboardExpireRemind,
  setFellowshipPromotable,
} from "next-common/store/reducers/userPromptsSlice";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";

const RankLevelNames = [
  "Candidates",
  "Member",
  "Proficient",
  "Fellow",
  "Architect",
  "Architect Adept",
  "Grand Architect",
  "Free Master",
  "Master Constant",
  "Grand Master",
];

function useMemberData() {
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const address = useRealAddress();

  const [collectiveMember, setCollectiveMember] = useState();
  const { loading: isCollectiveMemberLoading } = useSubStorage(
    collectivePallet,
    "members",
    [address],
    useCallback((rawOptional) => setCollectiveMember(rawOptional.toJSON()), []),
  );

  const [coreMember, setCoreMember] = useState();
  const { loading: isCoreMemberLoading } = useSubStorage(
    corePallet,
    "member",
    [address],
    useCallback((rawOptional) => setCoreMember(rawOptional.toJSON()), []),
  );

  const [coreParams, setCoreParams] = useState();
  const { loading: isCoreParamsLoading } = useSubStorage(
    corePallet,
    "params",
    [],
    useCallback((rawOptional) => setCoreParams(rawOptional.toJSON()), []),
  );

  const isLoading =
    isCollectiveMemberLoading || isCoreMemberLoading || isCoreParamsLoading;

  if (isLoading) {
    return {
      data: null,
      isLoading: true,
    };
  }

  return {
    data: {
      collectiveMember,
      coreMember,
      coreParams,
    },
    isLoading,
  };
}

function Rank({ rank }) {
  const textColor = getRankColor(rank);
  const bgColor = getRankColor(rank, 0.15);

  return (
    <div className="flex items-center gap-[8px] ">
      <div
        className={cn(
          "flex items-center justify-center",
          "w-[20px] py-[2px] rounded-[4px] text12Bold",
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {rank}
      </div>
      <span className="text-textPrimary text16Bold">
        {RankLevelNames[rank]}
      </span>
    </div>
  );
}

function Demotion({ lastProof, rank, params }) {
  const dispatch = useDispatch();
  const { section } = useCollectivesContext();
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });
  const blockTime = useSelector(blockTimeSelector);

  useEffect(() => {
    const isDemotionExpired = percentageValue === 100;
    const daysRemaining = new BigNumber(blockTime)
      .multipliedBy(remainingBlocks)
      .div(86400 * 1000)
      .toNumber();
    if (section === "fellowship") {
      if (rank > 0) {
        dispatch(setFellowshipDemotionExpired(isDemotionExpired));
        dispatch(
          setFellowshipDemotionExpireRemind(
            demotionPeriod > 0 && daysRemaining < 28,
          ),
        );
      } else {
        dispatch(setFellowshipOffboardExpired(isDemotionExpired));
        dispatch(
          setFellowshipOffboardExpireRemind(
            demotionPeriod > 0 && daysRemaining < 60,
          ),
        );
      }
    } else if (section === "ambassador") {
      if (rank > 0) {
        dispatch(setAmbassadorDemotionExpired(isDemotionExpired));
        dispatch(
          setAmbassadorDemotionExpireRemind(
            demotionPeriod > 0 && daysRemaining < 28,
          ),
        );
      } else {
        dispatch(setAmbassadorOffboardExpired(isDemotionExpired));
        dispatch(
          setAmbassadorOffboardExpireRemind(
            demotionPeriod > 0 && daysRemaining < 60,
          ),
        );
      }
    }
  }, [
    dispatch,
    section,
    percentageValue,
    blockTime,
    remainingBlocks,
    rank,
    demotionPeriod,
  ]);

  const remaining = useRemainingTime(remainingBlocks);

  if (isNil(demotionPeriod)) {
    return null;
  }

  let text = "";
  if (demotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Expired";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label={rank <= 0 ? "Offboard" : "Demotion"}
      total={demotionPeriod}
      remain={remainingBlocks}
      text={text}
    />
  );
}

function Promotion({ lastPromotion, rank, params }) {
  const dispatch = useDispatch();
  const { section } = useCollectivesContext();
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ rank, lastPromotion, params });

  useEffect(() => {
    const isPromotable = percentageValue === 100;
    if (section === "fellowship") {
      dispatch(setFellowshipPromotable(isPromotable));
    } else if (section === "ambassador") {
      dispatch(setAmbassadorPromotable(isPromotable));
    }
  }, [dispatch, section, percentageValue]);

  const remaining = useRemainingTime(remainingBlocks);

  if (isNil(promotionPeriod)) {
    return null;
  }

  let text = "";
  if (promotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Promotable";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label="Promotion"
      total={promotionPeriod}
      remain={remainingBlocks}
      text={text}
    />
  );
}

function MemberInfo() {
  const dispatch = useDispatch();
  const { data, isLoading } = useMemberData();

  useEffect(() => {
    dispatch(setFellowshipDemotionExpired(false));
    dispatch(setFellowshipPromotable(false));
    dispatch(setFellowshipDemotionExpireRemind(false));
    dispatch(setFellowshipOffboardExpired(false));
    dispatch(setFellowshipOffboardExpireRemind(false));
    dispatch(setAmbassadorDemotionExpired(false));
    dispatch(setAmbassadorPromotable(false));
    dispatch(setAmbassadorDemotionExpireRemind(false));
    dispatch(setAmbassadorOffboardExpired(false));
    dispatch(setAmbassadorOffboardExpireRemind(false));
  }, [dispatch]);

  if (isLoading) {
    return <FieldLoading />;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return <span className="text-textTertiary text16Bold">-</span>;
  }

  return (
    <div className="flex flex-col gap-[16px] mt-1">
      <Rank rank={collectiveMember?.rank} />
      <div className="flex flex-col gap-[4px]">
        <Demotion
          lastProof={coreMember?.lastProof}
          rank={collectiveMember?.rank}
          params={coreParams}
        />
        <Promotion
          lastPromotion={coreMember?.lastPromotion}
          rank={collectiveMember?.rank}
          params={coreParams}
        />
      </div>
    </div>
  );
}

function FellowshipMember() {
  return (
    <SummaryItem title="Fellowship">
      <CollectivesProvider section="fellowship">
        <MemberInfo />
      </CollectivesProvider>
    </SummaryItem>
  );
}

function AmbassadorMember() {
  return (
    <SummaryItem title="Ambassador">
      <CollectivesProvider section="ambassador">
        <MemberInfo />
      </CollectivesProvider>
    </SummaryItem>
  );
}

export default function CollectivesAccountInfo() {
  return (
    <SummaryLayout>
      <TotalBalance />
      <Transferrable />
      <FellowshipMember />
      <AmbassadorMember />
    </SummaryLayout>
  );
}
