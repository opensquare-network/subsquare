import styled from "styled-components";
import RemoveSVG from "./remove.svg";
import noop from "lodash.noop";
import { p_12_medium } from "next-common/styles/componentCss";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;

  ${p_12_medium}

  color: var(--textPrimary);

  border-radius: 4px;
  background: var(--gray100);
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

export default function SelectedValueItem({ title, onRemove = noop }) {
  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <span>{title}</span>
      <IconWrapper onClick={onRemove}>
        <RemoveSVG />
      </IconWrapper>
    </Wrapper>
  );
}
