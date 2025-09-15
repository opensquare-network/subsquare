import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimate } from "framer-motion";
import { useWindowSize } from "react-use";
import FellowshipFeedSuffix from "../fellowship/feeds/suffix";
import FellowshipFeedLeadingBar from "../fellowship/feeds/leading";
import { AddressUser } from "../user";
import { AvatarDisplay } from "../user/avatarDisplay";
import FellowshipCommonEvent from "../feeds/fellowshipCommonEvent";

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
      if (feedPages?.length < 4) return;
      animateHandle();
    }, 3000);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, feedPages?.length]);

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
          {(feedPages || []).map((feed, idx) => {
            const isLast = idx === feedPages.length - 1;
            return (
              <ScrollFeedItem
                key={
                  feed.event +
                  feed.indexer.blockHeight +
                  feed.indexer.eventIndex
                }
                item={feed}
                idx={idx}
                isLast={isLast}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScrollFeedItem({ item, isLast }) {
  const showUserInfo = item?.showUserInfo ?? true;
  const who = item?.args?.who;
  const displayWho = showUserInfo && who;

  return (
    <div
      key={item.event + item.indexer.blockHeight + item.indexer.eventIndex}
      className="flex group/datalist-item text14Medium h-[53px] max-sm:h-[96px]"
    >
      <FellowshipFeedLeadingBar className="pr-4" isLast={isLast} />
      <div className="flex pt-2">
        {displayWho && (
          <div className="mt-1 mr-2">
            <AvatarDisplay size={20} address={item?.args?.who} />
          </div>
        )}

        <div className="pr-2 pb-1 pt-1 gap-y-0.5 max-sm:items-start flex flex-wrap gap-x-1">
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
                className="w-3/5 max-sm:w-full"
                indexer={item?.indexer}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
