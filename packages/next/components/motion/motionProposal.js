import styled from "styled-components";
import InnerDataTable from "../table/innerDataTable";
import User from "components/user";

const Header = styled.div`
  width: 128px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
  margin-bottom: 12px;
`

const ArgsWrapper = styled.div`
  background: #F6F7FA;
  border-radius: 4px;
  padding: 32px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-x: scroll;
`;

const Wrapper = styled.div`
  max-width: 100%;
`;

function convertProposal(proposal, chain) {
  return ({
    ...proposal,
    args: Object.fromEntries(proposal.args.map(arg => {
      switch (arg.type) {
        case "Call":
        case "CallOf": {
          return [arg.name, convertProposal(arg.value)];
        }
        default: {
          return [arg.name, arg.value];
        }
      }
    }))
  })
}

export default function MotionProposal({ motion, chain }) {
  return (
    <Wrapper>
      <Header>Call</Header>
      <ArgsWrapper>
        <InnerDataTable data={convertProposal(motion.proposal, chain)} />
      </ArgsWrapper>
    </Wrapper>
  );
}
