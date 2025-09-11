import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Input from "next-common/lib/input";
import nextApi from "../../services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "../../store/reducers/toastSlice";
import { InputWrapper } from "./styled";
import {
  fetchAndUpdateUser,
  useUser,
  useUserContext,
} from "../../context/user";
import ErrorMessage from "../styled/errorMessage";
import { checkProxy } from "../../utils/proxy";
import styled from "styled-components";
import PrimaryButton from "next-common/lib/button/primary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { normalizeAddress } from "next-common/utils/address";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useContextApi } from "next-common/context/api";

const CustomErrorMessage = styled(ErrorMessage)`
  margin-top: 9px;
`;

const SuccessMessage = styled.div`
  padding: 10px 16px;
  margin-top: 9px;
  background: var(--green100);
  color: var(--green500);
  border-radius: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export default function ProxyAddress() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const user = useUser();
  const proxyAddress = user?.proxyAddress;
  const address = user?.address;

  const [inputAddress, setInputAddress] = useState(proxyAddress || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const userContext = useUserContext();
  const isSet = !!proxyAddress;
  const { ensureLogin } = useEnsureLogin();

  useEffect(() => {
    const maybeEvmAddress = tryConvertToEvmAddress(proxyAddress);
    setInputAddress(maybeEvmAddress || "");
    setErrorMsg();
    setSuccessMsg();

    if (api && proxyAddress) {
      checkProxy(api, proxyAddress, address).then(({ success, proxyTypes }) => {
        if (proxyTypes.length === 0) {
          setErrorMsg("Can't find the proxy setting on-chain.");
          return;
        }
        if (proxyTypes.length > 0 && !success) {
          setErrorMsg(
            `Proxy type: ${proxyTypes.join(
              ",",
            )}. Proxy type should be Governance, NonTransfer, or Any.`,
          );
          return;
        }
        setSuccessMsg(`Proxy type: ${proxyTypes.join(",")}`);
      });
    }
  }, [api, proxyAddress, address]);

  const onSet = async () => {
    setErrorMsg();
    setSuccessMsg();

    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!inputAddress) {
      setErrorMsg("Address can't be empty");
      return;
    }

    setIsLoading(true);

    const normalizedInputAddress = normalizeAddress(inputAddress);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { success, proxyTypes } = await checkProxy(
        api,
        normalizedInputAddress,
        address,
      );
      if (proxyTypes.length === 0) {
        setErrorMsg("Can't find the proxy setting on-chain.");
        return;
      }
      if (proxyTypes.length > 0 && !success) {
        setErrorMsg(
          `Proxy type: ${proxyTypes.join(
            ",",
          )}. Proxy type should be Governance, NonTransfer, or Any.`,
        );
        return;
      }

      const { result, error } = await nextApi.put("user/proxyaddress", {
        address: normalizedInputAddress,
      });
      if (result) {
        await fetchAndUpdateUser(userContext);
        dispatch(newSuccessToast("The proxy address has been set."));
      }
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnset = async () => {
    setIsLoading(true);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.delete("user/proxyaddress");
      if (result) {
        await fetchAndUpdateUser(userContext);
        dispatch(newSuccessToast("The proxy address has been unset."));
      }
      if (error) {
        setErrorMsg(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || !inputAddress;

  return (
    <InputWrapper>
      <Input
        placeholder="Please fill address..."
        value={inputAddress}
        onChange={(e) => {
          setInputAddress(e.target.value);
        }}
        disabled={isSet}
      />
      <PrimaryButton
        style={{ width: 55, height: 40 }}
        onClick={isSet ? onUnset : onSet}
        disabled={disabled}
        loading={isLoading}
      >
        {isSet ? "Unset" : "Set"}
      </PrimaryButton>
      {errorMsg && <CustomErrorMessage>{errorMsg}</CustomErrorMessage>}
      {successMsg && <SuccessMessage>{successMsg}</SuccessMessage>}
    </InputWrapper>
  );
}
