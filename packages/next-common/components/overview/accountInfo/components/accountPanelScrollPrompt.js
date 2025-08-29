import { DelegationPrompt } from "./useDelegationPrompt";
import { AvatarPrompt } from "./useSetAvatarPrompt";
import { IdentityPrompt } from "./useSetIdentityPrompt";
import { MultisigPrompt } from "./useMultisigPrompt";
import AssetHubManagePrompt from "./useAssetHubManagePrompt";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useWindowSize } from "react-use";
import { Fragment } from "react";

const ITEM_HEIGHT = 40;
const MOBILE_ITEM_HEIGHT = 60;
const ITEM_GAP = 4;

const promptComponents = [
  DelegationPrompt,
  AvatarPrompt,
  IdentityPrompt,
  MultisigPrompt,
  AssetHubManagePrompt,
];

export default function AccountPanelScrollPrompt() {
  const wrapperRef = useRef();
  const { width } = useWindowSize();
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
    setTotal(wrapperRef.current.children.length / 2);
  }, [random]);

  const marginTop = useMemo(() => {
    if (isMobile) {
      return (MOBILE_ITEM_HEIGHT + ITEM_GAP) * 1;
    }
    return (ITEM_HEIGHT + ITEM_GAP) * 1;
  }, [isMobile]);

  const indexRef = useRef(0);

  useEffect(() => {
    if (total < 2) {
      return;
    }

    const interval = setInterval(() => {
      if (pauseRef.current || !wrapperRef.current) {
        return;
      }
      if (indexRef.current > total) {
        wrapperRef.current?.scrollTo({
          top: 0,
        });
        indexRef.current = 1;
      }
      const scrollTop = wrapperRef.current?.scrollTop;

      animate(0, 100, {
        duration: 1,
        times: [0, 1],
        onUpdate: (v) => {
          wrapperRef.current?.scrollTo({
            top: (v / 100) * marginTop + scrollTop,
          });
        },
      });

      indexRef.current++;
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
      {[...promptComponents, ...promptComponents].map((Item, index) => {
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
      })}
    </div>
  );
}
