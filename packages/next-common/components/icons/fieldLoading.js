import { SystemLoadingDots } from "@osn/icons/subsquare";
import styled from "styled-components";

const Loading = styled(SystemLoadingDots)`
  & ellipse {
    fill: var(--textTertiary);
  }
`;

export default function FieldLoading() {
  return (
    <div className="inline-flex">
      <Loading />
    </div>
  );
}
