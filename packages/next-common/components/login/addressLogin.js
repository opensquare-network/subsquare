import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import nextApi from "../../services/nextApi";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import PrimaryButton from "../buttons/primaryButton";
import { stringToHex } from "@polkadot/util";
import { CACHE_KEY } from "../../utils/constants";
import { updateUser, useUserDispatch } from "../../context/user";
import { useChain } from "../../context/chain";
import { useCookieValue } from "../../utils/hooks/useCookieValue";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import SelectWalletAddress from "./selectWalletAddress";
import { useSetConnectedWallet } from "next-common/context/connectedWallet";

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

export default function AddressLogin({ setView }) {
  const chain = useChain();
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const router = useRouter();
  const [dontRemindEmail] = useCookieValue(CACHE_KEY.dontRemindEmail);
  const { closeLoginPopup } = useLoginPopup();
  const setConnectedWallet = useSetConnectedWallet();
  const isLoginPage = router.pathname === "/login";

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
            updateUser(loginResult, userDispatch);
            setConnectedWallet(selectedAccount.address);
            rememberLoginAddress(selectedAccount.address);
            rememberLoginExtension(
              selectedAccount.meta?.source || selectedWallet,
            );

            if (loginResult.email || dontRemindEmail) {
              if (isLoginPage) {
                router.replace(router.query?.redirect || "/");
              } else {
                closeLoginPopup();
              }
            } else {
              // Save account name for Email page
              rememberAccountName(selectedAccount, chain);

              if (isLoginPage) {
                router.replace({
                  pathname: "/email",
                  query: {
                    redirect: router.query?.redirect,
                  },
                });
              } else {
                setView("email");
              }
            }
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

  return (
    <div className="space-y-6">
      <SelectWalletAddress
        wallet={wallet}
        setWallet={setWallet}
        selectedWallet={selectedWallet}
        setSelectWallet={setSelectWallet}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        web3Error={web3Error}
        setWeb3Error={setWeb3Error}
        lastUsedAddress={localStorage.getItem(CACHE_KEY.lastLoginAddress)}
      />
      <ButtonWrapper>
        {selectedWallet && (
          <PrimaryButton
            isFill
            isLoading={loading}
            onClick={doWeb3Login}
            disabled={!selectedAccount}
          >
            Next
          </PrimaryButton>
        )}
        <div className="text14Medium text-center text-textSecondary">
          Login with{" "}
          <span
            className="text-theme500"
            role="button"
            onClick={() => {
              setView("account");
            }}
          >
            account
          </span>
        </div>
      </ButtonWrapper>
    </div>
  );
}
