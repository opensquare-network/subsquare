import clsx from "clsx";
import CirclePacking from "next-common/components/charts/circlePacking";
import { useNavCollapsed } from "next-common/context/nav";
import { useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

/**
 * @param {{ votes: any[]} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function VotesStats({ votes = [], ...props }) {
  // cache size, avoid re-render circle packing chart
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();
  const [navCollapsed] = useNavCollapsed();

  useEffect(() => {
    handleSize();
  }, [navCollapsed, ref.current]);

  useEventListener("resize", handleSize, ref.current);

  function handleSize() {
    const width = ref.current.offsetWidth;
    const height = ref.current.offsetHeight;
    setSize({ width, height });
  }

  const data = {
    name: "root",
    children: votes,
  };

  return (
    <div className={clsx(props.className, "w-full h-80")} {...props} ref={ref}>
      <CirclePacking data={data} width={size.width} height={size.height} />
    </div>
  );
}
