import useDailyStats from "./useDailyStats";

// No days argument: the api returns the whole history since the launch.
export default function useIssuanceStats() {
  return useDailyStats("dotusd/issuance-stats");
}
