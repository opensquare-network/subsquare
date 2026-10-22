import useDailyStats from "./useDailyStats";

// No days argument: the api returns the whole history since the launch.
export default function useHolderStats() {
  return useDailyStats("dotusd/holder-stats");
}
