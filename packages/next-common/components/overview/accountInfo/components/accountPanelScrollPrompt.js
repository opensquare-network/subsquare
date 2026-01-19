import { DelegationPrompt } from "./useDelegationPrompt";
import { AvatarPrompt } from "./useSetAvatarPrompt";
import { IdentityPrompt } from "./useSetIdentityPrompt";
import { MultisigPrompt } from "./useMultisigPrompt";
import AssetsManagePrompt from "./useAssetsManagePrompt";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { Fragment } from "react";
import AccountUnlockBalancePrompt from "./accountUnlockBalancePrompt";
import VestingUnlockablePrompt from "./vestingUnlockablePrompt";
import NominatorWithdrawUnbondedPrompt from "./nominatorWithdrawUnbondedPrompt";
import NominatorClaimRewardPrompt from "./nominatorClaimRewardPrompt";
import PoolWithdrawUnbondedPrompt from "./poolWithdrawUnbondedPrompt";
import PoolClaimRewardPrompt from "./poolClaimRewardPrompt";

const ITEM_HEIGHT = 40;
const MOBILE_ITEM_HEIGHT = 60;
const ITEM_GAP = 4;

const promptComponents = [
  DelegationPrompt,
  AvatarPrompt,
  IdentityPrompt,
  MultisigPrompt,
  AssetsManagePrompt,
  NominatorWithdrawUnbondedPrompt,
  NominatorClaimRewardPrompt,
  PoolWithdrawUnbondedPrompt,
  PoolClaimRewardPrompt,
  AccountUnlockBalancePrompt,
  VestingUnlockablePrompt,
];

export default function AccountPanelScrollPrompt() {
  const wrapperRef = useRef();
  const width = useWindowWidthContext();
  const isMobile = width < 768;
  const [total, setTotal] = useState(0);
  const pauseRef = useRef(false);

  const pageSize = total > 2 ? 2 : 1;

  const wrapperHeight = useMemo(() => {
    if (!total) {
      return 0;
    }
    if (isMobile) {
      return pageSize * MOBILE_ITEM_HEIGHT + ITEM_GAP * (pageSize - 1);
    }
    return pageSize * ITEM_HEIGHT + ITEM_GAP * (pageSize - 1);
  }, [isMobile, pageSize, total]);

  const [random, setRandom] = useState(1);
  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const updateTotal = () => {
      setTotal(Math.floor(wrapperRef.current.children.length / 3));
    };

    updateTotal();

    const observer = new MutationObserver(updateTotal);
    observer.observe(wrapperRef.current, { childList: true });

    return () => observer.disconnect();
  }, [random]);

  const marginTop = useMemo(() => {
    if (isMobile) {
      return MOBILE_ITEM_HEIGHT + ITEM_GAP;
    }
    return ITEM_HEIGHT + ITEM_GAP;
  }, [isMobile]);

  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    wrapperRef.current?.scrollTo({ top: 0 });

    if (total < 2) {
      return;
    }

    const interval = setInterval(() => {
      if (pauseRef.current || !wrapperRef.current) {
        return;
      }

      const nextIndex = indexRef.current + 1;
      const from = indexRef.current * marginTop;
      const to = nextIndex * marginTop;

      animate(from, to, {
        duration: 1,
        onUpdate: (latest) => {
          wrapperRef.current?.scrollTo({ top: latest });
        },
        onComplete: () => {
          indexRef.current = nextIndex;
          if (indexRef.current >= total) {
            indexRef.current -= total;
            wrapperRef.current?.scrollTo({ top: indexRef.current * marginTop });
          }
        },
      });
    }, 6500);
    return () => clearInterval(interval);
  }, [marginTop, total]);

  return (
    <div
      ref={wrapperRef}
      style={{
        height: wrapperHeight + "px",
        display: total ? "" : "none",
      }}
      className=" overflow-y-hidden flex flex-col gap-1"
      onMouseEnter={() => (pauseRef.current = true)}
      onMouseLeave={() => (pauseRef.current = false)}
    >
      {[...promptComponents, ...promptComponents, ...promptComponents].map(
        (Item, index) => {
          return (
            <Fragment key={index}>
              <Item
                key={random}
                onClose={() => {
                  setRandom(random + 1);
                }}
              />
            </Fragment>
          );
        },
      )}
    </div>
  );
}
