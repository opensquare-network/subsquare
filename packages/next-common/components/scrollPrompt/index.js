import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";
import { intersectionBy, unionBy } from "lodash-es";

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

export default function ScrollPrompt({ prompts }) {
  const [scrollingPrompts, setScrollingPrompts] = useState(prompts);
  const [scope, animate] = useAnimate();
  const pauseRef = useRef(false);

  useEffect(() => {
    setScrollingPrompts((prev) =>
      unionBy(intersectionBy(prev, prompts, "key"), prompts, "key"),
    );
  }, [prompts]);

  const shiftMessage = useCallback(() => {
    setScrollingPrompts((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current) {
        return;
      }
      if (!scope.current || !scope.current.firstChild) {
        return;
      }
      if (scope.current.firstChild.childNodes.length < 2) {
        return;
      }
      Promise.all([
        animate(scope.current, colorStyle[scrollingPrompts[1].type], {
          duration: 1,
        }),
        animate(
          "&>.scroll-list>:first-child",
          { marginTop: "-20px" },
          { duration: 1 },
        ),
      ])
        .then(shiftMessage)
        .then(() => {
          if (scope.current === null) {
            return;
          }
          animate(
            "&>.scroll-list>:first-child",
            { marginTop: "0px" },
            { duration: 0 },
          );
        });
    }, 6500);
    return () => clearInterval(interval);
  }, [scope, pauseRef, scrollingPrompts, shiftMessage, animate]);

  if (scrollingPrompts.length === 0) {
    return null;
  }

  return (
    <div
      ref={scope}
      className={cn(
        "flex justify-between",
        "h-[40px] rounded-[8px]",
        "text14Medium py-2.5 px-4",
      )}
      style={colorStyle[scrollingPrompts[0].type]}
    >
      <div
        className="scroll-list flex flex-col overflow-hidden"
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
      >
        {scrollingPrompts.map(({ key, message }) => (
          <div key={key} className="whitespace-nowrap">
            {message}
          </div>
        ))}
      </div>
      <SystemClose
        className="w-5 h-5"
        role="button"
        onClick={() => scrollingPrompts[0]?.close()}
      />
    </div>
  );
}
