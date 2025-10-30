import PoolsTag from "next-common/components/tags/state/pools";

export default function StatusColumn({ status }) {
  return <PoolsTag state={status} />;
}
