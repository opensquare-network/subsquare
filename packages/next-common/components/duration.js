import useNow from "next-common/hooks/useNow";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function Duration({ time, slice = 1 }) {
  const now = useNow();
  if (!time) {
    return;
  }
  return <span>{formatTimeAgo(time, { referenceTime: now, slice })}</span>;
}
