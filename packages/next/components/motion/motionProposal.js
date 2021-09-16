import styled from "styled-components";
import InnerDataTable from "../table/innerDataTable";
import { getNode, toPrecision } from "utils";

const Header = styled.div`
  width: 128px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
  margin-bottom: 12px;
`;

const ArgsWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  > table {
    border: 24px solid #f6f7fa;
  }
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-x: auto;
`;

const Wrapper = styled.div`
  max-width: 100%;
`;

function convertProposal(proposal, chain) {
  return {
    ...proposal,
    args: Object.fromEntries(
      proposal.args.map((arg) => {
        switch (arg.type) {
          case "Call":
          case "CallOf": {
            return [arg.name, convertProposal(arg.value, chain)];
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return [arg.name, arg.value.map((v) => convertProposal(v, chain))];
          }
          case "Balance": {
            const node = getNode(chain);
            if (!node) {
              return [arg.name, arg.value];
            }

            const decimals = node.decimals;
            const symbol = node.symbol;
            return [
              arg.name,
              `${toPrecision(arg.value ?? 0, decimals)} ${symbol}`,
            ];
          }
          default: {
            return [arg.name, arg.value];
          }
        }
      })
    ),
  };
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
