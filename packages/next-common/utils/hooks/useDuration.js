import { useEffect, useState } from "react";
import { timeDurationFromNow } from "..";

export default function useDuration(time) {
  const [duration, setDuration] = useState();
  useEffect(() => {
    if (!time) {
      return;
    }
    setDuration(timeDurationFromNow(time));
  }, [time]);
  return duration;
}
