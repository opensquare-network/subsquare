import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { setLayoutDetailSidebarHeight } from "next-common/store/reducers/layoutSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useMutationObserver } from "next-common/hooks/useMutationObserver";

/**
 * @param {import("react").HTMLAttributes<HTMLDivElement>} props - The props object containing the properties passed to the function.
 */
export function RightBarWrapper(props) {
  const dispatch = useDispatch();
  const ref = useRef();

  function setHeight() {
    dispatch(setLayoutDetailSidebarHeight(ref.current.clientHeight));
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
