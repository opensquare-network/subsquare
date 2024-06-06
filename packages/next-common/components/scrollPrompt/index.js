import { SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAnimate } from "framer-motion";

const ScrollList = styled.ul`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default function ScrollPrompt({
  messages,
  promptKey = "scroll-prompt-visible",
}) {
  const [scrollingMessages, setScrollingMessages] = useState(messages);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useCookieValue(promptKey, true);
  const [scope, animate] = useAnimate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      animate(
        "li:first-child",
        { marginTop: "-20px", display: "none" },
        { duration: 1 },
      )
        .then(shiftMessage)
        .then(() =>
          animate(
            "li:first-child",
            { marginTop: "0px", display: "block" },
            { duration: 0 },
          ),
        );
    }, 6500);
    return () => clearInterval(interval);
  }, [shiftMessage]);

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
        "h-[40px] rounded-[8px]",
        "text14Medium py-2.5 px-4",
        "bg-theme100 text-theme500",
      )}
    >
      <ScrollList ref={scope}>
        {scrollingMessages.map((item, index) => (
          <li key={index} className={cn("whitespace-nowrap")}>
            {item}
          </li>
        ))}
      </ScrollList>
      <SystemClose className="w-5 h-5" role="button" onClick={close} />
    </div>
  );
}
