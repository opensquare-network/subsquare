import React, { useEffect, useState, useCallback } from "react";
import { WALLETS } from "../../utils/consts/connect";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Loading from "../loading";
import { emptyFunction } from "../../utils";

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
    props.installed === true &&
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

  svg.SubWallet {
    border-radius: 16px;
  }

  ${(props) =>
    props.installed === false &&
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

const useInjectedWeb3 = () => {
  const isMounted = useIsMounted();
  const [injectedWeb3, setInjectedWeb3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (isMounted.current) {
          setLoading(false);
          setInjectedWeb3(window.injectedWeb3);
        }
      }, 1000);
    }
  }, []);

  return { loading, injectedWeb3 };
};

const Wallet = ({ wallet, onClick, selected = false, loading = false }) => {
  const [installed, setInstalled] = useState(null);
  const { loading: loadingInjectedWeb3, injectedWeb3 } = useInjectedWeb3();
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    // update if installed changes
    if (loadingInjectedWeb3) {
      return;
    }

    if (isMounted.current) {
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
    }
  }, [loadingInjectedWeb3, injectedWeb3, wallet?.extensionName, isMounted]);

  return (
    <WalletOption selected={selected} onClick={() => onClick(wallet)} installed={installed}>
      <Flex>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {installed === false && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {(loading || installed === null) && <Loading />}
    </WalletOption>
  );
};

export default function SelectWallet({
  selectedWallet,
  setSelectWallet,
  setAccounts,
  setWallet = emptyFunction,
  onSelect = emptyFunction,
  onAccessGranted = emptyFunction,
}) {
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);
  const { injectedWeb3 } = useInjectedWeb3();

  useEffect(() => {
    if (!injectedWeb3) {
      return;
    }

    for (let wallet of WALLETS) {
      if (injectedWeb3[wallet.extensionName]) {
        return;
      }
    }

    // For unknown wallet extensions
    (async () => {
      const polkadotDapp = await import("@polkadot/extension-dapp");
      const extensionUtils = await import("../../utils/extensionAccount");
      const web3Enable = polkadotDapp.web3Enable;
      const web3FromAddress = polkadotDapp.web3FromAddress;
      const polkadotWeb3Accounts = extensionUtils.polkadotWeb3Accounts;

      await web3Enable("subsquare");
      const extensionAccounts = await polkadotWeb3Accounts();
      const accounts = extensionAccounts.map((item) => {
        const {
          address,
          meta: { name },
        } = item;
        return {
          address,
          name,
        };
      });

      if (isMounted.current) {
        setAccounts(accounts);
        if (accounts?.length > 0) {
          const address = accounts[0].address;
          const injector = await web3FromAddress(address);
          setSelectWallet(injector.name);
          setWallet(injector);
        }
      }
    })();
  }, [injectedWeb3, setAccounts, setSelectWallet, setWallet, isMounted]);

  const loadAccounts = useCallback(async (selectedWallet) => {
    setAccounts(null);
    const extension = window?.injectedWeb3?.[selectedWallet];
    if (!extension) {
      return;
    }

    try {
      setWaitingPermissionWallet(selectedWallet);
      const wallet = await extension.enable("subsquare");
      const extensionAccounts = await wallet.accounts?.get();
      const excludeEthExtensionAccounts = extensionAccounts?.filter(
        (acc) => acc.type !== "ethereum"
      );

      if (isMounted.current) {
        setSelectWallet(selectedWallet);
        setWallet(wallet);
        setAccounts(excludeEthExtensionAccounts);
      }

      onAccessGranted && onAccessGranted();
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) {
        setWaitingPermissionWallet(null);
      }
    }
  }, [setAccounts, setSelectWallet, setWallet, onAccessGranted, isMounted]);

  const onWalletClick = useCallback((wallet) => {
    loadAccounts(wallet.extensionName);
    onSelect && onSelect(wallet.extensionName);
  }, [loadAccounts, onSelect]);

  return (
    <WalletOptions>
      {WALLETS.map((wallet, index) => {
        return (
          <Wallet
            key={index}
            wallet={wallet}
            onClick={onWalletClick}
            selected={wallet.extensionName === selectedWallet}
            loading={wallet.extensionName === waitingPermissionWallet}
          />
        );
      })}
    </WalletOptions>
  );
}
