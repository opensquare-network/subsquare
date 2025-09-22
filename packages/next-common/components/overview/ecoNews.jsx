import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import nextApi from "next-common/services/nextApi";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { SystemPlus } from "@osn/icons/subsquare";
import EditPopup from "../news/common/editPopup";
import { useDispatch } from "react-redux";
import {
  newSuccessToast,
  newErrorToast,
} from "next-common/store/reducers/toastSlice";
import { useChainSettings } from "next-common/context/chain";
import Loading from "../loading";
import { useEcoNewsData } from "../news/common/hooks";
import NoData from "../noData";
import { useAnimate } from "framer-motion";

export default function EcoNews(props) {
  const { ecoNews } = useChainSettings();
  if (!ecoNews) {
    return null;
  }
  return <EcoNewsImpl {...props} />;
}

const LINE_HEIGHT = 20;
const ITEM_GAP = 0;
const ITEM_PADDING = 20;

function EcoNewsImpl({ className, showItem = 5, lineClamp = 1, step = 1 }) {
  const { items, loading, setItems } = useEcoNewsData();
  const needScroll = showItem < items.length;
  const [containerRef, animate] = useAnimate();
  const pauseRef = useRef(false);
  const animateHandle = useCallback(() => {
    const marginTop =
      (lineClamp * LINE_HEIGHT + ITEM_PADDING + ITEM_GAP) * step;
    Promise.all([
      animate(
        "&>:first-child",
        {
          marginTop: `-${marginTop}px`,
        },
        { duration: 1 },
      ),
    ])
      .then(() => {
        setItems((prev) => {
          if (prev?.length < 1) {
            return prev;
          }
          const [first, ...rest] = prev;
          return [...rest, first];
        });
      })
      .then(() => {
        animate("&>:first-child", { marginTop: "0px" }, { duration: 0 });
      });
  }, [animate, lineClamp, setItems, step]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current) return;
      if (!containerRef.current || !containerRef.current.firstChild) return;
      if (items?.length <= showItem + step) return;
      animateHandle();
    }, 3000);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, items?.length, showItem, step]);

  return (
    <div className={className}>
      <TitleContainer className="flex justify-start mb-4 gap-1">
        Eco News
        <AddNews />
      </TitleContainer>
      <div className="p-6 bg-neutral100 shadow-100 border border-neutral300 rounded-xl overflow-hidden">
        <div
          ref={containerRef}
          className="h-full overflow-hidden scroll-list"
          style={{
            height: needScroll
              ? showItem * (LINE_HEIGHT + ITEM_PADDING) * lineClamp +
                ITEM_GAP * (showItem - 1)
              : "auto",
          }}
          onMouseEnter={() => (pauseRef.current = true)}
          onMouseLeave={() => (pauseRef.current = false)}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loading size={24} />
            </div>
          ) : (
            <NewsList list={items} lineClamp={lineClamp} />
          )}
        </div>
      </div>
    </div>
  );
}

import Bar from "next-common/components/fellowship/feeds/bar";
import Tooltip from "../tooltip";

function NewsList({ list, lineClamp }) {
  if (!list?.length) {
    return <NoData text="No news data" />;
  }

  return (
    <ul className="text14Medium text-textPrimary ">
      {list?.map((item, index) => (
        <li
          key={index}
          className="flex items-center rounded-md"
          style={{
            height: lineClamp * LINE_HEIGHT + ITEM_PADDING,
          }}
        >
          <div
            className={"inline-flex flex-col mr-4"}
            style={{
              height: lineClamp * LINE_HEIGHT + ITEM_PADDING,
            }}
          >
            <Bar />

            <div className="w-3 h-5 flex items-center">
              <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
            </div>

            <Bar />
          </div>
          <p className={`line-clamp-${lineClamp}`} title={item.content}>
            {item.link ? (
              <Link
                href={item.link}
                target="_block"
                className="hover:underline"
              >
                {item.content}
              </Link>
            ) : (
              item.content
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

function AddNews() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const addNews = async (data) => {
    setLoading(true);
    const { error } = await nextApi
      .post("eco-news/review", data)
      .finally(() => {
        setLoading(false);
      });
    if (!error) {
      setOpen(false);
      dispatch(newSuccessToast("Submit successfully!"));
    } else {
      dispatch(
        newErrorToast(
          error.message || "Failed to submit news. Please try again.",
        ),
      );
    }
  };
  return (
    <>
      <Tooltip content="Report">
        <button
          className=" rounded-full bg-neutral500  text-textPrimaryContrast"
          onClick={() => setOpen(true)}
        >
          <SystemPlus className="w-3 h-3" />
        </button>
      </Tooltip>
      {open && (
        <EditPopup
          title="Add News"
          isLoading={loading}
          onConfirm={addNews}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
