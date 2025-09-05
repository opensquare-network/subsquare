import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimate } from "framer-motion";
import { useWindowSize } from "react-use";
import FellowshipCoreFeedsListEvent from "../fellowship/core/feeds/event";
import FellowshipFeedSuffix from "../fellowship/feeds/suffix";
import FellowshipFeedLeadingBar from "../fellowship/feeds/leading";

export const PromptTypes = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
  NEUTRAL: "neutral",
};

export const colorStyle = {
  [PromptTypes.INFO]: {
    backgroundColor: "var(--theme100)",
    color: "var(--theme500)",
  },
  [PromptTypes.WARNING]: {
    backgroundColor: "var(--orange100)",
    color: "var(--orange500)",
  },
  [PromptTypes.ERROR]: {
    backgroundColor: "var(--red100)",
    color: "var(--red500)",
  },
  [PromptTypes.SUCCESS]: {
    backgroundColor: "var(--green100)",
    color: "var(--green500)",
  },
  [PromptTypes.NEUTRAL]: {
    backgroundColor: "var(--gray100)",
    color: "var(--gray500)",
  },
};

const ITEM_HEIGHT = 56;
const MOBILE_ITEM_HEIGHT = 56;
const ITEM_GAP = 0; // space-y-1

export default function ScrollFeeds({
  feeds = [],
  pageSize = 4,
  defaultStep = 4,
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const step = defaultStep;
  const [feedPages, setFeedPages] = useState([]);
  const [containerRef, animate] = useAnimate();
  const pauseRef = useRef(false);

  useEffect(() => {
    setFeedPages(feeds);
  }, [feeds]);

  const wrapperHeight = useMemo(() => {
    if (isMobile) {
      return pageSize * MOBILE_ITEM_HEIGHT + ITEM_GAP * (pageSize - 1);
    }
    return pageSize * ITEM_HEIGHT + ITEM_GAP * (pageSize - 1);
  }, [isMobile, pageSize]);

  const marginTop = useMemo(() => {
    if (isMobile) {
      return (MOBILE_ITEM_HEIGHT + ITEM_GAP) * step;
    }
    return (ITEM_HEIGHT + ITEM_GAP) * step;
  }, [isMobile, step]);

  const animateHandle = useCallback(() => {
    Promise.all([
      animate(
        "&>.scroll-list>:first-child",
        { marginTop: `-${marginTop}px` },
        { duration: 1 },
      ),
    ])
      .then(() => {
        setFeedPages((prev) => {
          if (prev.length < 4) {
            return prev;
          }
          return [...prev.slice(4), ...prev.slice(0, 4)];
        });
      })
      .then(() => {
        animate(
          "&>.scroll-list>:first-child",
          { marginTop: "0px" },
          { duration: 0 },
        );
      });
  }, [animate, marginTop]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current) return;
      if (!containerRef.current || !containerRef.current.firstChild) return;
      if (feedPages?.length < 4) return;
      animateHandle();
    }, 6500);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, feedPages?.length]);

  if (feedPages?.length === 0 || pageSize <= 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: wrapperHeight + "px",
      }}
    >
      <div
        className="scroll-list flex flex-col overflow-hidden gap-1"
        style={{
          height: wrapperHeight + "px",
        }}
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
      >
        <div className="flex flex-col">
          {(feedPages || []).map((item, idx) => {
            const isLast = idx === feeds.length - 1;
            return (
              <div
                key={
                  item.event +
                  item.indexer.blockHeight +
                  item.indexer.eventIndex
                }
                className="flex group/datalist-item text14Medium"
              >
                <FellowshipFeedLeadingBar className="pr-4" isLast={isLast} />
                <div className="pt-2 flex flex-col gap-y-1 pb-1">
                  <div>
                    <FellowshipCoreFeedsListEvent
                      feed={item}
                      className="pr-2 [&>span]:whitespace-nowrap"
                    />
                  </div>
                  <div className="pl-7">
                    <FellowshipFeedSuffix indexer={item?.indexer} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ScrollPromptItemWrapper({ prompt }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  return (
    <div
      key={prompt.key}
      className={cn(
        "flex justify-between items-center rounded-lg",
        "text14Medium py-2.5 px-4 flex-shrink-0",
        isMobile ? "h-[60px]" : "h-[40px]",
      )}
      style={colorStyle[prompt.type || PromptTypes.NEUTRAL]}
    >
      <div>{prompt.message}</div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0"
        role="button"
        onClick={prompt.close}
      />
    </div>
  );
}
