import useDailyStats from "./useDailyStats";

export const holderStatsDays = 7;

export default function useHolderStats() {
  return useDailyStats("dotusd/holder-stats", holderStatsDays);
}
