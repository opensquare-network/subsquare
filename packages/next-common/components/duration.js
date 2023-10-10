import { timeDurationFromNow } from "next-common/utils";
import { useEffect, useState } from "react";

export default function Duration({ time }) {
  const [duration, setDuration] = useState();

  useEffect(() => {
    if (!time) {
      return;
    }
    setDuration(timeDurationFromNow(time));
  }, [time]);

  return <span>{duration}</span>;
}
