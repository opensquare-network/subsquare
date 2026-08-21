import CaretLeft from "../../../assets/imgs/icons/pager-caret-left.svg";
import CaretRight from "../../../assets/imgs/icons/pager-caret-right.svg";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageButton = styled.button`
  cursor: pointer;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    stroke: var(--textSecondary);
  }

  :hover {
    background: var(--neutral200);
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;

      svg path {
        stroke: var(--textTertiary);
      }

      :hover {
        background: none;
      }
    `}
`;

const FirstPageButton = styled(PageButton)`
  width: auto;
  padding: 0 8px;
  color: var(--textSecondary);
  font-size: 12px;
  font-weight: 500;

  :disabled {
    color: var(--textTertiary);
  }
`;

export default function CursorPagination({
  disabled = false,
  hasNextPage,
  hasPreviousPage,
  onFirstPage,
  onNextPage,
  onPreviousPage,
}) {
  if (!hasPreviousPage && !hasNextPage) {
    return null;
  }

  return (
    <Wrapper>
      <FirstPageButton
        aria-label="First page"
        disabled={disabled || !hasPreviousPage}
        onClick={onFirstPage}
        type="button"
      >
        First
      </FirstPageButton>
      <PageButton
        aria-label="Previous page"
        disabled={disabled || !hasPreviousPage}
        onClick={onPreviousPage}
        type="button"
      >
        <CaretLeft />
      </PageButton>
      <PageButton
        aria-label="Next page"
        disabled={disabled || !hasNextPage}
        onClick={onNextPage}
        type="button"
      >
        <CaretRight />
      </PageButton>
    </Wrapper>
  );
}
