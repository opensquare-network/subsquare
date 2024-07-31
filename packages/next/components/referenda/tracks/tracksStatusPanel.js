import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TrackStatusItem from "./trackStatusItem";

export default function TracksStatusPanel() {
  return (
    <SecondaryCard>
      <TrackStatusItem />
    </SecondaryCard>
  );
}
