import React from "react";
import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isWeb3Injected, web3Enable } from "@polkadot/extension-dapp";
import { useRouter } from "next/router";

import AddressSelect from "../addressSelect";
import Button from "../button";
import useIsMounted from "../../utils/hooks/useIsMounted";
import DownloadExtension from "../downloadExtension";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { setUser } from "../../store/reducers/userSlice";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import { signMessage } from "../../services/extension/signMessage";
import { polkadotWeb3Accounts } from "../../utils/extensionAccount";
import useDarkMode from "../../utils/hooks/useDarkMode";

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
  ${(props) =>
    props?.theme === "dark" &&
    css`
      button > div {
        background: none;
      }
    `}
`;

export default function AddressLogin({ chain, setMailLogin }) {
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [theme] = useDarkMode();

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
  }, [isMounted]);

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
      <ButtonWrapper theme={theme}>
        {hasExtension && (
          <Button
            theme={theme}
            isFill
            secondary
            onClick={doWeb3Login}
            isLoading={loading}
          >
            Next
          </Button>
        )}
        <Button isFill onClick={setMailLogin}>
          Login with username
        </Button>
      </ButtonWrapper>
    </>
  );
}
