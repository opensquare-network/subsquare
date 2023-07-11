import clsx from "clsx";
import { useNavCollapsed } from "next-common/context/nav";
import { setLayoutDetailSiderHeight } from "next-common/store/reducers/layoutSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

/**
 * @param {import("react").HTMLAttributes<HTMLDivElement>} props - The props object containing the properties passed to the function.
 */
export function RightBarWrapper(props) {
  const dispatch = useDispatch();
  const ref = useRef();
  useEffect(() => {
    dispatch(setLayoutDetailSiderHeight(ref.current.clientHeight));
  }, []);

  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      ref={ref}
      {...props}
      className={clsx(
        "flex flex-col",
        "space-y-6",
        "absolute right-6 top-0 w-[320px] mt-0",
        "max-md:static max-md:w-auto max-md:mt-4",
        !navCollapsed && "max-lg:p-6",
        !navCollapsed && "max-lg:static max-lg:w-auto max-lg:mt-4",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
