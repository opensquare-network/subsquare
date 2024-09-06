import { Close } from "./icons";
import { useCallback, useEffect, useState } from "react";
import tw from "tailwind-styled-components";

const Wrapper = tw.div`
  flex
  justify-between
  text-orange500
  bg-orange100
  rounded-[4px]
  px-[10px]
  py-[16px]
  mb-[16px]
  text14Medium
`;

const CloseWrapper = tw.div`
  cursor-pointer
  flex
  items-center
  [&_svg_path]:stroke-orange500
`;

function calcIsClosed(name) {
  if (!name) {
    return false;
  }

  const stored = localStorage.getItem(`CloseableWarning-${name}`);
  if (!stored) {
    return false;
  }

  try {
    const { closedAt, rememberCloseTime } = JSON.parse(stored);
    return Date.now() - closedAt <= rememberCloseTime;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default function ClosableWarning({ name, rememberCloseTime, children }) {
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    setIsClosed(calcIsClosed(name));
  }, [name]);

  const onClose = useCallback(() => {
    if (name && rememberCloseTime) {
      localStorage.setItem(
        `CloseableWarning-${name}`,
        JSON.stringify({
          closedAt: Date.now(),
          rememberCloseTime,
        }),
      );
    }

    setIsClosed(true);
  }, [name, rememberCloseTime]);

  if (isClosed) {
    return null;
  }

  return (
    <Wrapper>
      <span>{children}</span>
      <CloseWrapper onClick={onClose}>
        <Close />
      </CloseWrapper>
    </Wrapper>
  );
}
