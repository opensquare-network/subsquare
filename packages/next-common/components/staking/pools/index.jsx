import { useBondedPools } from "./hooks/useBondedPools";

export default function Pools() {
  useBondedPools();

  return <div>Pools</div>;
}
