import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import { isWeb3Injected, web3Enable } from "@polkadot/extension-dapp";
import { useRouter } from "next/router";

import AddressSelect from "../addressSelect";
import useIsMounted from "../../utils/hooks/useIsMounted";
import DownloadExtension from "../downloadExtension";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { setUser } from "../../store/reducers/userSlice";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import { signMessage } from "../../services/extension/signMessage";
import { polkadotWeb3Accounts } from "../../utils/extensionAccount";
import GhostButton from "../buttons/ghostButton";
import SecondaryButton from "../buttons/secondaryButton";
import Flex from "../styled/flex";
import { WALLETS } from "../../utils/consts/connect";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

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
    `}
  span.wallet-not-installed {
    font-size: 12px;
    font-weight: 400;
  }
`;

const Wallet = ({ wallet, onClick }) => {
  return (
    <WalletOption onClick={onClick} installed={!!wallet?.installed}>
      <Flex>
        <img className={wallet.title} src={wallet.logo} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {!wallet.installed && (
        <span className="wallet-not-installed">Not installed</span>
      )}
    </WalletOption>
  );
};

export default function AddressLogin({ chain, setMailLogin }) {
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("polkadot-js");
  const dispatch = useDispatch();
  const router = useRouter();

  const doWeb3Login = async () => {
    setLoading(true);
    const address = encodeAddressToChain(selectedAccount.address, chain);
    const { result, error } = await nextApi.fetch(`auth/login/${address}`);
    if (error) {
      setWeb3Error(error.message);
    }
    if (result?.challenge) {
      try {
        const signature = await signMessage(
          result?.challenge,
          selectedAccount.address
        );
        const { result: loginResult, error: loginError } = await nextApi.post(
          `auth/login/${result?.attemptId}`,
          { challengeAnswer: signature }
        );
        if (loginResult) {
          dispatch(setUser(loginResult));
          localStorage.setItem("lastLoggedInAddress", selectedAccount.address);
          if (loginResult.email) {
            router.replace(router.query?.redirect || "/");
          } else {
            router.replace({
              pathname: "/email",
              query: {
                redirect: router.query?.redirect,
              },
            });
          }
        }
        if (loginError) {
          setWeb3Error(loginError.message);
        }
      } catch (e) {
        if (e.message !== "Cancelled") {
          dispatch(newErrorToast(e.message));
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await web3Enable("subsquare");
      if (!isWeb3Injected) {
        if (isMounted.current) {
          setHasExtension(false);
        }
        return;
      }
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
    })();
  }, [selectedWallet, isMounted]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      const address = localStorage.getItem("lastLoggedInAddress");
      if (address) {
        const account = accounts.find((item) => item.address === address);
        if (account) {
          setSelectedAccount(account);
          return;
        }
      }

      setSelectedAccount(accounts[0]);
    }
    setWeb3Error();
  }, [chain, accounts, selectedAccount]);

  return (
    <>
      <WalletOptions>
        {WALLETS.map((wallet, index) => {
          const installed = !!(
            typeof window !== "undefined" &&
            window.injectedWeb3 &&
            window?.injectedWeb3?.[wallet.extensionName]
          );
          const walletInfo = { ...wallet, installed };
          return (
            <Wallet
              wallet={walletInfo}
              onClick={() => setSelectWallet(wallet.extensionName)}
              key={index}
            />
          );
        })}
      </WalletOptions>
      {hasExtension && (
        <div>
          <Label>Choose linked address</Label>
          <AddressSelect
            chain={chain}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelect={(account) => {
              setSelectedAccount(account);
            }}
          />
          {web3Error && <ErrorText>{web3Error}</ErrorText>}
        </div>
      )}
      {!hasExtension && <DownloadExtension />}
      <ButtonWrapper>
        {hasExtension && (
          <SecondaryButton isFill isLoading={loading} onClick={doWeb3Login}>
            Next
          </SecondaryButton>
        )}
        <GhostButton isFill onClick={setMailLogin}>
          Login with username
        </GhostButton>
      </ButtonWrapper>
    </>
  );
}
