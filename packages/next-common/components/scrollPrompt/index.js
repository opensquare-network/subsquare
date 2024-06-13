import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useAnimate } from "framer-motion";
import { intersectionBy, unionBy } from "lodash-es";

const ScrollList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

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
      if (scope.current === null) {
        return;
      }
      if (scope.current.childNodes.length < 2) {
        return;
      }
      animate("&>:first-child", { marginTop: "-20px" }, { duration: 1 })
        .then(shiftMessage)
        .then(() => {
          if (scope.current === null) {
            return;
          }
          animate("&>:first-child", { marginTop: "0px" }, { duration: 0 });
        });
    }, 6500);
    return () => clearInterval(interval);
  }, [scope, pauseRef, shiftMessage]);

  if (scrollingPrompts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex justify-between",
        "h-[40px] rounded-[8px]",
        "text14Medium py-2.5 px-4",
        "bg-theme100 text-theme500",
      )}
    >
      <ScrollList
        ref={scope}
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
      >
        {scrollingPrompts.map(({ key, message }) => (
          <div key={key} className="whitespace-nowrap">
            {message}
          </div>
        ))}
      </ScrollList>
      <SystemClose
        className="w-5 h-5"
        role="button"
        onClick={() => scrollingPrompts[0]?.close()}
      />
    </div>
  );
}
