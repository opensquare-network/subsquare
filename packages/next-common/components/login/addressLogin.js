import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Flex from "../styled/flex";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import AddressSelect from "../addressSelect";
import useIsMounted from "../../utils/hooks/useIsMounted";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { setUser } from "../../store/reducers/userSlice";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import SecondaryButton from "../buttons/secondaryButton";
import { WALLETS } from "../../utils/consts/connect";
import { stringToHex } from "@polkadot/util";
import { LinkWrapper } from "./styled";

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
    `}
  span.wallet-not-installed {
    font-size: 12px;
    font-weight: 400;
  }
`;

const ErrorMessage = styled.div`
  padding: 10px 16px;
  margin-top: 24px;
  //fixme: somehow theme won't work
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border-radius: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
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
  return (
    <WalletOption
      selected={selected}
      onClick={onClick}
      installed={!!wallet?.installed}
    >
      <Flex>
        <img className={wallet.title} src={wallet.logo} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {!wallet.installed && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {selected && <Linked>Linked</Linked>}
    </WalletOption>
  );
};

export default function AddressLogin({ chain, setMailLogin }) {
  const isMounted = useIsMounted();
  const [wallet, setWallet] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
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
        const { signature } = await wallet.signer.signRaw({
          type: "bytes",
          data: stringToHex(result?.challenge),
          address: selectedAccount.address,
        });

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
      const extension = window?.injectedWeb3?.[selectedWallet];
      if (!extension) {
        return;
      }
      const wallet = await extension.enable("subsquare");
      setWallet(wallet);
      const extensionAccounts = await wallet.accounts.get();
      if (isMounted.current) {
        setAccounts(extensionAccounts);
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

  useEffect(() => {
    if (accounts?.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [selectedWallet, accounts]);

  return (
    <>
      <WalletOptions>
        {WALLETS.map((wallet, index) => {
          const walletInfo = {
            ...wallet,
            installed: getIsInstalled(wallet.extensionName),
          };
          return (
            <Wallet
              wallet={walletInfo}
              onClick={() => setSelectWallet(wallet.extensionName)}
              key={index}
              selected={wallet.extensionName === selectedWallet}
            />
          );
        })}
      </WalletOptions>
      {selectedWallet && accounts.length > 0 && (
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

      {wallet && accounts.length === 0 && (
        <ErrorMessage>
          Address not detected, please create an available address.
        </ErrorMessage>
      )}

      <ButtonWrapper>
        {selectedWallet && accounts.length > 0 && (
          <SecondaryButton isFill isLoading={loading} onClick={doWeb3Login}>
            Next
          </SecondaryButton>
        )}
        <LinkWrapper>
          <a onClick={setMailLogin}>Login </a>with username
        </LinkWrapper>
      </ButtonWrapper>
    </>
  );
}
