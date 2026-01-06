import ProfileVestingSummary from "./summary";
import ProfileVestingShchedules from "./shchedules";
import { ProfileVestingProvider } from "./context";
import {
  VestPopupProvider,
  useVestPopup,
} from "next-common/components/data/vesting/context/vestPopupContext";
import { useProfileVestingContext } from "./context";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VestPopup = dynamicPopup(() =>
  import("next-common/components/data/vesting/popup/vestPopup"),
);

function VestPopupInContext() {
  const { update } = useProfileVestingContext();
  const { visible, hideVestPopup } = useVestPopup();
  if (!visible) {
    return null;
  }

  return <VestPopup onClose={hideVestPopup} update={update} />;
}

export default function ProfileVesting() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileVestingProvider>
        <VestPopupProvider>
          <ProfileVestingSummary />
          <ProfileVestingShchedules />
          <VestPopupInContext />
        </VestPopupProvider>
      </ProfileVestingProvider>
    </div>
  );
}
