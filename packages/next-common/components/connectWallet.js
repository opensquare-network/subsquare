import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import AddressSelect from "./addressSelect";
import nextApi from "../services/nextApi";
import ErrorText from "./ErrorText";
import { newErrorToast } from "../store/reducers/toastSlice";
import { encodeAddressToChain } from "../services/address";
import SecondaryButton from "./buttons/secondaryButton";
import { stringToHex } from "@polkadot/util";
import SelectWallet from "./wallet/selectWallet";
import { CACHE_KEY } from "../utils/constants";
import { getWallets } from "../utils/consts/connect";
import { updateUser, useUserDispatch } from "../context/user";
import { useChain } from "../context/chain";
import Popup from "./popup/wrapper/Popup";
import ErrorMessage from "./styled/errorMessage";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";

const Title = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`;

const ContentWrapper = styled.div`
  ul {
    all: unset;
  }
  > :nth-child(3),
  > :nth-child(4),
  > :nth-child(5) {
    margin-top: 24px;
  }
`;

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

function rememberLoginExtension(extensionName) {
  localStorage.setItem(CACHE_KEY.lastLoginExtension, extensionName);
}

function rememberLoginAddress(address) {
  localStorage.setItem(CACHE_KEY.lastLoginAddress, address);
}

function rememberAccountName(account, chain) {
  const accountMap = JSON.parse(
    localStorage.getItem(CACHE_KEY.accountMap) ?? "{}",
  );
  accountMap[encodeAddressToChain(account.address, chain)] = account.name;
  localStorage.setItem(CACHE_KEY.accountMap, JSON.stringify(accountMap));
}

export default function ConnectWallet({ onClose, onLoggedIn }) {
  const chain = useChain();
  const [wallet, setWallet] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();

  async function signWith(message, address, selectedWallet) {
    if (selectedWallet === WalletTypes.METAMASK) {
      return await personalSign(stringToHex(message), address);
    }

    const { signature } = await wallet.signer.signRaw({
      type: "bytes",
      data: stringToHex(message),
      address,
    });

    return signature;
  }

  const doWeb3Login = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    setLoading(true);
    try {
      const address = encodeAddressToChain(selectedAccount.address, chain);

      const { result, error } = await nextApi.fetch(`auth/login/${address}`);
      if (error) {
        setWeb3Error(error.message);
      }
      if (result?.challenge) {
        let challengeAnswer;
        try {
          challengeAnswer = await signWith(
            result.challenge,
            selectedAccount.address,
            selectedWallet,
          );
        } catch (e) {
          if (e.message !== "Cancelled") {
            dispatch(newErrorToast(e.message));
          }
          return;
        }

        try {
          const { result: loginResult, error: loginError } = await nextApi.post(
            `auth/login/${result?.attemptId}`,
            { challengeAnswer, signer: selectedWallet },
          );

          if (loginResult) {
            onLoggedIn(true);
            updateUser(loginResult, userDispatch);

            rememberLoginAddress(selectedAccount.address);
            rememberLoginExtension(
              selectedAccount.meta?.source || selectedWallet,
            );
            return;
          }
          if (loginError) {
            setWeb3Error(loginError.message);
          }
        } catch (e) {
          dispatch(newErrorToast(e.message));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedAccount();
    if (accounts?.length > 0) {
      const address = localStorage.getItem(CACHE_KEY.lastLoginAddress);
      if (address) {
        const account = accounts?.find((item) => item.address === address);
        if (account) {
          setSelectedAccount(account);
          return;
        }
      }

      setSelectedAccount(accounts[0]);
    }
    setWeb3Error();
  }, [selectedWallet, accounts]);

  const onSelectAccount = useCallback(
    async (account) => {
      setSelectedAccount(account);

      if (
        !getWallets().some(
          ({ extensionName }) => extensionName === selectedWallet,
        )
      ) {
        const extensionDapp = await import("@polkadot/extension-dapp");
        await extensionDapp.web3Enable("subsquare");
        const injector = await extensionDapp.web3FromSource(
          account.meta?.source,
        );
        setWallet(injector);
      }

      // Save account name for Email page
      rememberAccountName(account, chain);
    },
    [selectedWallet, chain],
  );

  return (
    <Popup onClose={onClose}>
      <ContentWrapper>
        <Title>Login</Title>
        <SelectWallet
          selectedWallet={selectedWallet}
          setSelectWallet={setSelectWallet}
          setAccounts={setAccounts}
          setWallet={setWallet}
        />

        {wallet && accounts?.length === 0 && (
          <ErrorMessage>
            Address not detected, please create an available address.
          </ErrorMessage>
        )}

        {selectedWallet && (
          <div>
            <Label>Choose linked address</Label>
            <AddressSelect
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelect={onSelectAccount}
            />
            {web3Error && <ErrorText>{web3Error}</ErrorText>}
          </div>
        )}

        <ButtonWrapper>
          {selectedWallet && (
            <SecondaryButton
              isFill
              isLoading={loading}
              onClick={doWeb3Login}
              disabled={!selectedAccount}
            >
              Next
            </SecondaryButton>
          )}
        </ButtonWrapper>
      </ContentWrapper>
    </Popup>
  );
}
