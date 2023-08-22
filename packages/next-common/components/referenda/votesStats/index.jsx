import CirclePacking from "next-common/components/charts/circlePacking";
import { useNavCollapsed } from "next-common/context/nav";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEventListener } from "usehooks-ts";

// TODO: votes should passed from props
export default function ReferendaVotesStats() {
  // cache size, avoid re-render circle packing chart
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();
  const votes = useSelector(allVotesSelector);
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
    <div className="w-full h-80" ref={ref}>
      <CirclePacking data={data} width={size.width} height={size.height} />
    </div>
  );
}
