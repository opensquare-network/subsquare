import styled from "styled-components";
import BlockSVG from "./block.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  > :nth-child(1) {
    margin-right: 4px;
  }
`;

const BlockIcon = styled(BlockSVG)`
  path {
    stroke: ${(p) => p.theme.textPrimary};
  }
`;

export default function BlockHeight({ number }) {
  return (
    <Wrapper className="text12Medium">
      <BlockIcon />
      <div className="text-textTertiary">{number}</div>
    </Wrapper>
  );
}
