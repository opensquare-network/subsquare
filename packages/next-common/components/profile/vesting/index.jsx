import ProfileVestingSummary from "./summary";
import ProfileVestingShchedules from "./shchedules";
import { ProfileVestingProvider } from "./context";

export default function ProfileVesting() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileVestingProvider>
        <ProfileVestingSummary />
        <ProfileVestingShchedules />
      </ProfileVestingProvider>
    </div>
  );
}
