import { WALLETS } from "../../utils/consts/connect";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import React, { useEffect, useState } from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Loading from "../loading";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { polkadotWeb3Accounts } from "../../utils/extensionAccount";

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

  img.SubWallet {
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
  useEffect(() => {
    if (typeof window !== "undefined" && window.injectedWeb3) {
      setTimeout(() => {
        if (isMounted.current) {
          setInjectedWeb3(window.injectedWeb3);
        }
      }, 1000);
    }
  }, []);
  return injectedWeb3;
};

const Wallet = ({ wallet, onClick, selected = false, loading = false }) => {
  const [installed, setInstalled] = useState(null);
  const injectedWeb3 = useInjectedWeb3();
  const isMounted = useIsMounted();

  useEffect(() => {
    // update if installed changes
    if (injectedWeb3 && isMounted.current) {
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
    }
  }, [injectedWeb3]);

  return (
    <WalletOption selected={selected} onClick={onClick} installed={installed}>
      <Flex>
        <img className={wallet.title} src={wallet.logo} alt={wallet.title} />
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
  setWallet = () => {},
  onSelect = () => {},
  onAccessGranted = () => {},
}) {
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);
  const injectedWeb3 = useInjectedWeb3();

  useEffect(() => {
    if (!injectedWeb3) {
      return;
    }
    for (let wallet of WALLETS) {
      if (injectedWeb3[wallet.extensionName]) {
        return;
      }
    }
    (async () => {
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
      }
      const injector = await web3FromAddress(accounts[0].address);
      setSelectWallet(injector.name);
      setWallet(injector);
    })();
  }, [injectedWeb3]);

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
        const extensionAccounts = await wallet.accounts?.get();
        if (isMounted.current) {
          setSelectWallet(selectedWallet);
          setWallet(wallet);
          setAccounts(extensionAccounts);
        }
        onAccessGranted && onAccessGranted();
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted.current) {
          setWaitingPermissionWallet(null);
        }
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
