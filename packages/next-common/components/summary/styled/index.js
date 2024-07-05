import styled, { css } from "styled-components";
import { SecondaryCard } from "../../styled/containers/secondaryCard";
import tw from "tailwind-styled-components";

export const SummaryWrapper = styled.div`
  display: flex;
  gap: 16px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SummaryCard = styled(SecondaryCard)`
  position: relative;
  color: var(--textPrimary);
  flex: 1;
`;

export const SummaryTitle = tw.div`whitespace-nowrap text12Medium text-textTertiary`;

export const SummaryGreyText = styled.div`
  color: var(--textTertiary) !important;
`;

export const SummaryItemWrapper = tw.div`
  flex
  max-sm:gap-4 max-sm:flex-wrap
`;
export const SummaryItem = tw.div`
  flex-1
  max-sm:min-w-[calc(50%-16px)]
`;
export const SummaryItemTitle = SummaryTitle;

export const Button = styled.div`
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
      color: var(--textSecondary);

      svg {
        path {
          stroke: var(--textSecondary);
        }
      }
    `}

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: var(--textPrimary);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  background-color: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  :hover {
    border-color: var(--neutral500);
  }

  svg {
    path {
      stroke: var(--textPrimary);
    }
  }
`;

export const SummaryDescription = tw.p`
  m-0 mt-1
  text-textTertiary text14Medium
`;
