import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import AddressSelect from "../addressSelect";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { setUser } from "../../store/reducers/userSlice";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import SecondaryButton from "../buttons/secondaryButton";
import { stringToHex } from "@polkadot/util";
import { LinkWrapper } from "./styled";
import SelectWallet from "../wallet/selectWallet";

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

export default function AddressLogin({ chain, setMailLogin }) {
  const [wallet, setWallet] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const doWeb3Login = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }
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
    if (accounts && accounts?.length > 0 && !selectedAccount) {
      const address = localStorage.getItem("lastLoggedInAddress");
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
  }, [chain, accounts, selectedAccount]);

  useEffect(() => {
    if (accounts?.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [selectedWallet, accounts]);

  return (
    <>
      <SelectWallet
        selectedWallet={selectedWallet}
        setSelectWallet={setSelectWallet}
        setAccounts={setAccounts}
        setWallet={setWallet}
      />
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

      {wallet && accounts?.length === 0 && (
        <ErrorMessage>
          Address not detected, please create an available address.
        </ErrorMessage>
      )}

      <ButtonWrapper>
        {selectedWallet && (
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
