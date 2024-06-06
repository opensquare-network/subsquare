import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const ScrollDiv = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @keyframes scroll-up {
    from {
      margin-top: 0;
    }
    to {
      margin-top: -20px;
    }
  }

  & > .scroll {
    animation: scroll-up 1.5s;
  }
`;

export default function ScrollPrompt({
  messages,
  promptKey = "scroll-prompt-visible",
}) {
  const [scrollingMessages, setScrollingMessages] = useState(messages);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useCookieValue(promptKey, true);
  const [scrolling, setScrolling] = useState(false);

  const shiftMessage = useCallback(() => {
    setScrollingMessages((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, []);

  useEffect(() => {
    setVisible(value);
  }, [value]);

  function close() {
    setValue(false, { expires: 15 });
  }

  function scroll() {
    setScrolling(true);
  }

  function cleanScroll() {
    setScrolling(false);
  }

  useEffect(() => {
    const interval = setInterval(scroll, 6500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return null;
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex justify-between",
        "h-[40px] rounded-[8px] overflow-hidden",
        "text14Medium py-2.5 px-4",
        "bg-theme100 text-theme500",
      )}
    >
      <ScrollDiv>
        {scrollingMessages.map((item, index) => (
          <div
            key={index}
            className={cn(
              "whitespace-nowrap",
              index === 0 &&
                scrollingMessages.length > 1 &&
                scrolling &&
                "scroll",
            )}
            onAnimationEnd={() => {
              shiftMessage();
              cleanScroll();
            }}
          >
            {item}
          </div>
        ))}
      </ScrollDiv>
      <SystemClose className="w-5 h-5" role="button" onClick={close} />
    </div>
  );
}
