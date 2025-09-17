import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimate } from "framer-motion";
import { useWindowSize } from "react-use";
import FellowshipFeedSuffix from "../fellowship/feeds/suffix";
import FellowshipFeedLeadingBar from "../fellowship/feeds/leading";
import { AddressUser } from "../user";
import { AvatarDisplay } from "../user/avatarDisplay";
import FellowshipCommonEvent, {
  SECTIONS,
} from "../feeds/fellowshipCommonEvent";
import { cn } from "next-common/utils";
import { GreyPanel } from "../styled/containers/greyPanel";
import Link from "next/link";

const ITEM_HEIGHT = 53;
const MOBILE_ITEM_HEIGHT = 96;
const ITEM_GAP = 0; // space-y-1

export default function ScrollFeeds({
  feeds = [],
  pageSize = 6,
  defaultStep = 1,
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const step = defaultStep;
  const [feedPages, setFeedPages] = useState([]);
  const [containerRef, animate] = useAnimate();
  const pauseRef = useRef(false);

  useEffect(() => {
    if (feeds?.length <= pageSize) {
      setFeedPages(feeds);
      return;
    }
    setFeedPages(fillEmptySpace(feeds));
  }, [feeds, pageSize]);

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
          if (prev.length < 1) {
            return prev;
          }
          const [first, ...rest] = prev;
          return [...rest, first];
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
      if (feedPages?.length <= pageSize) return;
      animateHandle();
    }, 3000);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, feedPages?.length, pageSize]);

  const feedsKeys = useMemo(() => {
    const firstFeed = feeds[0];
    const lastFeed = feeds[feeds.length - 1];
    if (!firstFeed || !lastFeed) {
      return [];
    }
    return [getFeedKey(firstFeed), getFeedKey(lastFeed)];
  }, [feeds]);

  if (feedPages?.length === 0 || pageSize <= 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
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
          {(feedPages || []).map((feed) => {
            if (feed.isEmpty) {
              return <EmptySplitFeed key="emptySplitFeed" />;
            }

            const key = getFeedKey(feed);
            const [firstKey, lastKey] = feedsKeys;
            const isFirst = key === firstKey;
            const isLast = key === lastKey;
            return (
              <ScrollFeedItem
                key={
                  feed.event +
                  feed.indexer.blockHeight +
                  feed.indexer.eventIndex
                }
                item={feed}
                idx={key}
                isLast={isLast}
                isFirst={isFirst}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScrollFeedItem({ item, isLast, isFirst }) {
  const showUserInfo = item?.showUserInfo ?? true;
  const who = item?.args?.who;
  const displayWho = showUserInfo && who;
  const isFullEventSuffix = eventSuffixIsFull({
    section: item?.section,
    event: item?.event,
  });

  return (
    <div
      key={item.event + item.indexer.blockHeight + item.indexer.eventIndex}
      className="flex group/datalist-item text14Medium h-[53px] max-sm:h-[96px]"
    >
      <FellowshipFeedLeadingBar
        className="pr-4"
        isLast={isLast}
        isFirst={isFirst}
      />
      <div className="flex pt-3">
        {displayWho && (
          <div className="mt-1 mr-2">
            <AvatarDisplay size={20} address={item?.args?.who} />
          </div>
        )}

        <div className="pr-2 pb-1 pt-1 max-sm:items-start flex flex-wrap gap-x-1 max-sm:block max-sm:justify-center">
          <FellowshipCommonEvent
            feed={item}
            showUserInfo={false}
            prefix={
              displayWho ? (
                <AddressUser showAvatar={false} add={item?.args?.who} />
              ) : null
            }
            suffix={
              <FellowshipFeedSuffix
                className={cn(
                  "max-sm:w-full [&>*]:text12Medium",
                  isFullEventSuffix ? "w-full" : "w-3/5",
                )}
                indexer={item?.indexer}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

function eventSuffixIsFull({ section, event }) {
  if (section === SECTIONS.FELLOWSHIP_CORE) {
    return ["Inducted"].includes(event);
  }
  if (section === SECTIONS.FELLOWSHIP_SALARY) {
    return ["Inducted", "CycleEnded", "CycleStarted"].includes(event);
  }
  if (section === SECTIONS.FELLOWSHIP_REFERENDA) {
    return [
      "Submitted",
      "DecisionStarted",
      "Cancelled",
      "ConfirmAborted",
      "ConfirmStarted",
      "Confirmed",
      "Killed",
      "Rejected",
      "TimedOut",
    ].includes(event);
  }
  return false;
}

function EmptySplitFeed() {
  return (
    <div className="flex flex-col text14Medium h-[53px] max-sm:h-[96px] items-center justify-center w-full pl-6">
      <GreyPanel className="text12Medium text-textSecondary py-2.5 px-4 w-full mt-3">
        Check all feeds{" "}
        <Link className="text-theme500 ml-1" href="/fellowship/feeds">
          here
        </Link>
        .
      </GreyPanel>
    </div>
  );
}

function getFeedKey(feed) {
  return `${feed?.event}-${feed?.indexer?.blockHeight}-${feed?.indexer?.eventIndex}`;
}

function fillEmptySpace(feeds = []) {
  return [...feeds, { isEmpty: true, key: "isEmpty" }];
}
