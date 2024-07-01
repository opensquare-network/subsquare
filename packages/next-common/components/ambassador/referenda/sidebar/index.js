import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import Gov2Status from "@subsquare/next/components/gov2/sidebar/status";

export default function AmbassadorReferendumSideBar() {
  return (
    <RightBarWrapper>
      <Gov2Status />
    </RightBarWrapper>
  );
}
