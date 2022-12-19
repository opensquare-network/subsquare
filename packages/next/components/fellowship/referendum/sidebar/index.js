import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";

export default function FellowshipReferendumSideBar() {
  return (
    <RightBarWrapper>
      <Gov2Status />
      <FellowshipTally />
    </RightBarWrapper>
  );
}
