import styled from "styled-components";
import InfoBlock from "@osn/icons/subsquare/InfoBlock";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  > :nth-child(1) {
    margin-right: 4px;
  }
`;

const BlockIcon = styled(InfoBlock)`
  width: 16px;
  height: 16px;
  path {
    stroke: ${(p) => p.theme.textTertiary};
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
