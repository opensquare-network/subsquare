import useCoretimeStatus from "next-common/context/coretime/status";
import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import useRelayBlockNumber from "next-common/context/coretime/hooks/useRelayBlockNumber";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

function useLatestTimesliceReadyToCommit() {
  const relayNumber = useRelayBlockNumber();
  const configuration = useCoretimeConfiguration();
  const advanced = relayNumber + configuration.advanceNotice;
  return Math.floor(advanced / CORETIME_TIMESLICE_PERIOD);
}

function useNextTimesliceToCommit() {
  const latestTimeslice = useLatestTimesliceReadyToCommit();
  const status = useCoretimeStatus();
  const { lastCommittedTimeslice } = status;
  if (lastCommittedTimeslice < latestTimeslice) {
    return lastCommittedTimeslice + 1;
  } else {
    return
  }

}

export default function useSaleEnd() {
  const sale = useCoretimeSale();
  const { info: { regionEnd } = {} } = sale;
  // todo: 1. if sale is final, then return
  // todo: 2.

  const status = useCoretimeStatus();
  const configuration = useCoretimeConfiguration();

  // todo: 1. get next_timeslice_to_commit
}
