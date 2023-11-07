import { useRouter } from "next/router";
import { SystemDisconnect } from "@osn/icons/subsquare";
import { Wrapper } from "./styled";
import GhostButton from "next-common/components/buttons/ghostButton";

export default function NoLinkAddress() {
  const router = useRouter();
  const goLinkAddress = () => {
    router.push("/settings/linked-address");
  };

  return (
    <Wrapper>
      <div className="flex justify-between gap-[16px] grow">
        <div className="flex gap-[12px]">
          <SystemDisconnect width={40} height={40} />
          <div className="flex flex-col">
            <span className="text-textPrimary text14Bold">
              Please Link Your Web3 Address
            </span>
            <span className="text-textTertiary text14Medium">
              Connect to network and participate in on-chain governance
            </span>
          </div>
        </div>
        <GhostButton onClick={goLinkAddress}>Linked Address</GhostButton>
      </div>
    </Wrapper>
  );
}
