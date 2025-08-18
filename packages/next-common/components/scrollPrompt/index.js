import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

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

const ITEM_HEIGHT = 40;
const ITEM_GAP = 4; // space-y-1

export default function ScrollPrompt({
  prompts,
  setPrompts,
  pageSize = 2,
  defaultStep = 1,
}) {
  const step = defaultStep;
  const [promptPages, setPromptPages] = useState([]);
  const [containerRef, animate] = useAnimate();
  const pauseRef = useRef(false);

  useEffect(() => {
    setPromptPages(prompts);
  }, [prompts]);

  const wrapperHeight = pageSize * ITEM_HEIGHT + ITEM_GAP * (pageSize - 1);

  const animateHandle = useCallback(() => {
    Promise.all([
      animate(
        "&>.scroll-list>:first-child",
        { marginTop: `-${(ITEM_HEIGHT + ITEM_GAP) * step}px` },
        { duration: 1 },
      ),
    ])
      .then(() => {
        setPromptPages((prev) => {
          if (prev.length < 2) {
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
  }, [animate, step]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current) return;
      if (!containerRef.current || !containerRef.current.firstChild) return;
      if (promptPages.length < 2) return;
      animateHandle();
    }, 6500);
    return () => clearInterval(interval);
  }, [animateHandle, containerRef, promptPages.length]);

  if (promptPages.length === 0 || pageSize <= 0) {
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
        {promptPages.map((prompt) => {
          return (
            <div
              key={prompt.key}
              className={cn(
                "flex justify-between",
                "h-[40px] rounded-[8px]",
                "text14Medium py-2.5 px-4",
              )}
              style={colorStyle[prompt.type || PromptTypes.NEUTRAL]}
            >
              <div>{prompt.message}</div>
              <SystemClose
                className="w-5 h-5"
                role="button"
                onClick={() => {
                  setPrompts((prev) =>
                    prev.filter((p) => p.key !== prompt.key),
                  );
                  prompt?.close?.();
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
