import styled, { css } from "styled-components";

export const WalletOption = styled.li`
  all: unset;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    gap: 16px;
  }

  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: var(--textPrimary);
  background: var(--neutral200);

  ${(props) =>
    props.installed === true &&
    css`
      &:hover {
        background: var(--neutral300);
      }
    `}

  ${(props) =>
    props.selected &&
    css`
      background: var(--neutral300);
    `}

  border-radius: 4px;
  cursor: pointer;

  svg.SubWallet {
    border-radius: 16px;
  }

  ${(props) =>
    props.installed === false &&
    css`
      color: var(--textTertiary);
      cursor: not-allowed;
      pointer-events: none;
      user-select: none;
    `}
  span.wallet-not-installed {
    font-size: 12px;
    font-weight: 400;
  }
`;
