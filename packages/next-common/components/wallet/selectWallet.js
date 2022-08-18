import { WALLETS } from "../../utils/consts/connect";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import React, { useEffect, useState } from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Loading from "../loading";

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

const getIsInstalled = (extensionName) => {
  return !!(
    typeof window !== "undefined" &&
    window.injectedWeb3 &&
    window?.injectedWeb3?.[extensionName]
  );
};

const Wallet = ({ wallet, onClick, selected = false, loading = false }) => {
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
      {loading && <Loading />}
    </WalletOption>
  );
};

export default function SelectWallet({
  selectedWallet,
  setSelectWallet,
  setAccounts,
  setWallet = () => {},
  onSelect = () => {},
  onAccessGranted = () => {},
}) {
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);

  const loadAccounts = (selectedWallet) => {
    (async () => {
      setAccounts(null);
      const extension = window?.injectedWeb3?.[selectedWallet];
      if (!extension) {
        return;
      }
      try {
        setWaitingPermissionWallet(selectedWallet);
        const wallet = await extension.enable("subsquare");
        setSelectWallet(selectedWallet);
        setWallet(wallet);
        const extensionAccounts = await wallet.accounts?.get();
        if (isMounted.current) {
          setAccounts(extensionAccounts);
        }
        onAccessGranted && onAccessGranted();
      } catch (e) {
        console.error(e);
      } finally {
        setWaitingPermissionWallet(null);
      }
    })();
  };

  return (
    <WalletOptions>
      {WALLETS.map((wallet, index) => {
        return (
          <Wallet
            key={index}
            wallet={wallet}
            onClick={() => {
              loadAccounts(wallet.extensionName);
              onSelect && onSelect(wallet.extensionName);
            }}
            selected={wallet.extensionName === selectedWallet}
            loading={wallet.extensionName === waitingPermissionWallet}
          />
        );
      })}
    </WalletOptions>
  );
}
