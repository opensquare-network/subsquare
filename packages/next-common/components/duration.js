import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import { useEffect, useState } from "react";

export default function Duration({ time }) {
  const [duration, setDuration] = useState();

  useEffect(() => {
    if (!time) {
      return;
    }
    setDuration(formatTimeAgo(time));
  }, [time]);

  return <span>{duration}</span>;
}
