import { SystemDisconnect } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";

export default function NotLoginPanel() {
  const { openLoginPopup } = useLoginPopup();

  return (
    <NeutralPanel className="p-6">
      <div className="flex justify-between gap-[16px] grow max-md:flex-col">
        <div className="flex gap-[12px] grow max-md:flex-col">
          <SystemDisconnect
            className="[&_path]:fill-textTertiary"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <span className="text-textPrimary text14Bold">Please Connect</span>
            <span className="text-textTertiary text14Medium">
              Connect to network and participate in on-chain governance
            </span>
          </div>
        </div>
        <div className="flex justify-end items-center grow">
          <PrimaryButton onClick={() => openLoginPopup()}>
            Connect
          </PrimaryButton>
        </div>
      </div>
    </NeutralPanel>
  );
}
