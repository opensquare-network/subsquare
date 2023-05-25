import { useTimelineData } from "../../index";

export default function useIsDemocracyPassed() {
  const timeline = useTimelineData();
  const item = timeline.reverse().find(item => "Passed" === item.method);
  return !!item;
}
