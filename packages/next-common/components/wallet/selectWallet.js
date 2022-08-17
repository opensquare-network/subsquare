import { WALLETS } from "../../utils/consts/connect";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import React, { useEffect, useState } from "react";

const WalletOptions = styled.ul`
  all: unset;

  li:first-child {
    margin-top: 24px;
  }

  li:not(:first-child) {
    margin-top: 8px;
  }
`;

const WalletOption = styled.li`
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
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.grey100Bg};

  ${(props) =>
    props.installed &&
    css`
      &:hover {
        background: ${(props) => props.theme.grey200Border};
      }
    `}

  ${(props) =>
    props.selected &&
    css`
      background: ${(props) => props.theme.grey200Border};
    `}

  border-radius: 4px;
  cursor: pointer;

  img.SubWallet {
    border-radius: 16px;
  }

  ${(props) =>
    !props.installed &&
    css`
      color: ${props.theme.textTertiary};
      cursor: not-allowed;
      pointer-events: none;
      user-select: none;
    `}
  span.wallet-not-installed {
    font-size: 12px;
    font-weight: 400;
  }
`;

const Linked = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textTertiary};
`;

const getIsInstalled = (extensionName) => {
  return !!(
    typeof window !== "undefined" &&
    window.injectedWeb3 &&
    window?.injectedWeb3?.[extensionName]
  );
};

const Wallet = ({ wallet, onClick, selected = false }) => {
  const [installed, setInstalled] = useState(
    getIsInstalled(wallet.extensionName)
  );

  useEffect(() => {
    // update if installed changes
    setInstalled(getIsInstalled(wallet.extensionName));
  }, []);

  return (
    <WalletOption selected={selected} onClick={onClick} installed={installed}>
      <Flex>
        <img className={wallet.title} src={wallet.logo} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {!installed && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {selected && <Linked>Linked</Linked>}
    </WalletOption>
  );
};

export default function SelectWallet({ selectedWallet, setSelectWallet }) {
  return (
    <WalletOptions>
      {WALLETS.map((wallet, index) => {
        return (
          <Wallet
            wallet={wallet}
            onClick={() => setSelectWallet(wallet.extensionName)}
            key={index}
            selected={wallet.extensionName === selectedWallet}
          />
        );
      })}
    </WalletOptions>
  );
}
