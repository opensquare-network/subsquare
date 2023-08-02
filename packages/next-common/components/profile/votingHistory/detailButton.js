import DetailIcon from "./icons/detail.svg";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  svg {
    rect {
      stroke: var(--neutral400);
    }
    path {
      fill: var(--textPrimary);
    }
  }
`;

export default function DetailButton({ onClick }) {
  return (
    <ButtonWrapper onClick={onClick}>
      <DetailIcon />
    </ButtonWrapper>
  );
}
