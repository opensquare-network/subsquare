import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";
import { useRouter } from "next/router";

import AddressSelect from "components/addressSelect";
import Button from "./button";
import { useIsMounted } from "utils/hooks";
import DownloadExtension from "components/downloadExtension";
import {
  encodeKaruraAddress,
  encodeKhalaAddress,
  encodeKusamaAddress,
  encodePolkadotAddress,
  encodeBasiliskAddress,
  signMessage,
} from "services/chainApi";
import nextApi from "services/nextApi";
import ErrorText from "./ErrorText";
import { setUser } from "store/reducers/userSlice";
import { addToast } from "../store/reducers/toastSlice";

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

export default function AddressLogin({ onBack }) {
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  let chain = "karura";
  if (typeof window !== "undefined") {
    chain = localStorage.getItem("chain") || "karura";
  }

  const doWeb3Login = async () => {
    setLoading(true);
    const address = selectedAccount[`${chain}Address`];
    const { result, error } = await nextApi.fetch(
      `auth/login/${chain}/${address}`
    );
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
          router.replace("/");
        }
        if (loginError) {
          setWeb3Error(loginError.message);
        }
      } catch (e) {
        if (e.toString() !== "Error: Cancelled") {
          dispatch(
            addToast({
              type: "error",
              message: e.toString(),
            })
          );
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
      const extensionAccounts = await web3Accounts();
      const accounts = extensionAccounts.map((item) => {
        const {
          address,
          meta: { name },
        } = item;
        return {
          address,
          kusamaAddress: encodeKusamaAddress(address),
          polkadotAddress: encodePolkadotAddress(address),
          karuraAddress: encodeKaruraAddress(address),
          khalaAddress: encodeKhalaAddress(address),
          basiliskAddress: encodeBasiliskAddress(address),
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
      <ButtonWrapper>
        {hasExtension && (
          <Button isFill secondary onClick={doWeb3Login} isLoading={loading}>
            Login
          </Button>
        )}
        <Button isFill onClick={onBack}>
          Login with username
        </Button>
      </ButtonWrapper>
    </>
  );
}
