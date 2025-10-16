import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

import { useMemoValue } from "./useMemoValue";
import useIsMountedRef from "./useIsMountedRef";
import useCall from "./useCall";

export default function useEventTrigger(checks, filter) {
  const api = useContextApi();

  const [state, setState] = useState(() => EMPTY_RESULT);
  const memoChecks = useMemoValue(checks);
  const mountedRef = useIsMountedRef();
  const eventRecords = useCall(api?.query?.system?.events);

  useEffect(() => {
    if (mountedRef.current && eventRecords) {
      const events = eventRecords.filter(
        (r) =>
          r.event && memoChecks.some((c) => c && c.is(r.event)) && filter(r),
      );

      if (events.length) {
        setState({
          blockHash: eventRecords.createdAtHash?.toHex() || "",
          events,
        });
      }
    }
  }, [eventRecords, filter, memoChecks, mountedRef]);

  return state;
}

const EMPTY_RESULT = {
  blockHash: "",
  events: [],
};
