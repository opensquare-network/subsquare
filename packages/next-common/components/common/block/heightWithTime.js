import BlockValue from "next-common/components/democracy/metadata/blockValue";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";

export default function HeightWithTime({ height }) {
  const { timestamp, isEstimated } = useBlockTimestamp(height);
  return (
    <BlockValue height={height} time={timestamp} isEstimated={isEstimated} />
  );
}
