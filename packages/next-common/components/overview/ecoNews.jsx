import Link from "next-common/components/link";
import { useDispatch } from "react-redux";
import { useAnimate } from "framer-motion";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  newSuccessToast,
  newErrorToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import Tooltip from "next-common/components/tooltip";
import Bar from "next-common/components/fellowship/feeds/bar";
import EditPopup from "next-common/components/news/common/editPopup";
import { useEcoNewsData } from "next-common/components/news/common/hooks";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useChainSettings } from "next-common/context/chain";

const LINE_HEIGHT = 20;
const ITEM_PADDING = 20;
const SHOW_TOTAL = 5;

export default function EcoNews(props) {
  const { ecoNews } = useChainSettings();

  if (!ecoNews) {
    return null;
  }

  return <EcoNewsImpl {...props} />;
}

function EcoNewsImpl({ className }) {
  const { items } = useEcoNewsData();

  if (!items?.length) {
    return null;
  }

  return (
    <div className={className}>
      <TitleContainer className="flex justify-start mb-4 gap-1">
        Eco News
        <AddNews />
      </TitleContainer>
      <div className="p-6 bg-neutral100 shadow-100 border border-neutral300 rounded-xl overflow-hidden">
        <EcoNewsScroll data={items} />
      </div>
    </div>
  );
}

function EcoNewsScroll({ data }) {
  const [list, setList] = useState(data);
  const needScroll = SHOW_TOTAL < list.length;
  const [containerRef, animate] = useAnimate();
  const pauseRef = useRef(false);
  const width = useWindowWidthContext();
  const itemHeight = useMemo(() => {
    if (width < 768) {
      return LINE_HEIGHT * 2 + ITEM_PADDING;
    }
    return LINE_HEIGHT + ITEM_PADDING;
  }, [width]);

  const animateHandle = useCallback(() => {
    const marginTop = itemHeight;
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
        setList((prev) => {
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
  }, [animate, itemHeight, setList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current) return;
      if (!containerRef.current || !containerRef.current.firstChild) return;
      if (!needScroll) return;
      animateHandle();
    }, 3000);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, list.length, needScroll]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden scroll-list"
      style={{
        height: needScroll ? SHOW_TOTAL * itemHeight : "auto",
      }}
      onMouseEnter={() => (pauseRef.current = true)}
      onMouseLeave={() => (pauseRef.current = false)}
    >
      <ul className="text14Medium text-textPrimary ">
        {list?.map((item, index) => (
          <li
            key={index}
            className="flex items-center rounded-md"
            style={{
              height: itemHeight,
            }}
          >
            <div className={"inline-flex flex-col mr-4 h-full"}>
              <Bar />
              <div className="w-3 h-5 flex items-center">
                <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
              </div>
              <Bar />
            </div>
            {item.link ? (
              <Link
                className={"sm:line-clamp-1 line-clamp-2 hover:underline"}
                title={item.content}
                href={item.link}
                target="_block"
              >
                {item.content}
              </Link>
            ) : (
              <p
                className={"sm:line-clamp-1 line-clamp-2"}
                title={item.content}
              >
                {item.content}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
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
      <Tooltip content="Report" className="flex items-center">
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
