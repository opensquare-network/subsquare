import AllDelegationCard from "./allDelegationCard";
import PublicAnnouncement from "./publicAnnouncement";

export default function MyDelegationSection() {
  return (
    <div className="flex flex-col gap-[16px]">
      <AllDelegationCard />
      <PublicAnnouncement />
    </div>
  );
}
