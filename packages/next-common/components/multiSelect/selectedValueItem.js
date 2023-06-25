import styled from "styled-components";
import RemoveSVG from "./remove.svg";
import noop from "lodash.noop";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;

  color: ${p => p.theme.textPrimary};

  border-radius: 4px;
  background: ${p => p.theme.grey100Bg};
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

export default function SelectedValueItem({ title, onRemove = noop }) {
  return (
    <Wrapper>
      <span>{title}</span>
      <IconWrapper onClick={onRemove}>
        <RemoveSVG />
      </IconWrapper>
    </Wrapper>
  );
}
