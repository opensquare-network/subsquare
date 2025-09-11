import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { useEffect, useRef } from "react";
import { useMutationObserver } from "next-common/hooks/useMutationObserver";
import { createGlobalState } from "react-use";

export const useLayoutSidebarHeight = createGlobalState(0);

/**
 * @param {import("react").HTMLAttributes<HTMLDivElement>} props - The props object containing the properties passed to the function.
 */
export function RightBarWrapper(props) {
  const [, setSidebarHeight] = useLayoutSidebarHeight();
  const ref = useRef();

  function setHeight() {
    setSidebarHeight(ref.current.clientHeight);
  }

  useEffect(() => {
    setHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMutationObserver(
    () => {
      setHeight();
    },
    ref,
    { childList: true },
  );

  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col",
        "space-y-6",
        "absolute right-0 top-0 w-[320px] mt-0",
        "max-md:static max-md:w-auto",
        !navCollapsed && "max-lg:static max-lg:w-auto",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
