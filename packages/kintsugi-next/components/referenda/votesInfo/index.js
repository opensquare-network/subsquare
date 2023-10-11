import styled from "styled-components";
import { p_12_medium } from "next-common/styles/componentCss";
import Calls from "./voteCalls";
import Votes from "./votes";

const VotesGroupLabel = styled.div`
  ${p_12_medium};
  color: var(--textPrimary);
`;

export default function VotesInfo() {
  return (
    <div className="flex items-center justify-between mt-4">
      <VotesGroupLabel>Votes</VotesGroupLabel>
      <div className="flex items-center gap-x-3">
        <Votes />
        <Calls />
      </div>
    </div>
  );
}
