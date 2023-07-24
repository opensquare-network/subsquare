import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../input";
import nextApi from "../../services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "../../store/reducers/toastSlice";
import { InputWrapper, Label } from "./styled";
import PrimaryButton from "../buttons/primaryButton";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "../../context/user";
import ErrorMessage from "../styled/errorMessage";
import useApi from "../../utils/hooks/useApi";
import { checkProxy } from "../../utils/proxy";
import styled from "styled-components";

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
  const api = useApi();
  const dispatch = useDispatch();
  const loginUser = useUser();
  const [inputAddress, setInputAddres] = useState(
    loginUser?.proxyAddress || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const userDispatch = useUserDispatch();
  const isSet = !!loginUser?.proxyAddress;

  useEffect(() => {
    setInputAddres(loginUser?.proxyAddress || "");
    setErrorMsg();
    setSuccessMsg();

    if (api && loginUser?.proxyAddress) {
      checkProxy(api, loginUser?.proxyAddress, loginUser?.address).then(
        ({ success, proxyTypes }) => {
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
        },
      );
    }
  }, [api, loginUser?.proxyAddress]);

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

    try {
      const { success, proxyTypes } = await checkProxy(
        api,
        inputAddress,
        loginUser?.address,
      );
      if (proxyTypes.length === 0) {
        setErrorMsg("Can't find the proxy setting on-chain.");
        return;
      }
      if (proxyTypes.length > 0 && !success) {
        setErrorMsg(
          `Proxy type: ${proxyTypes.join(
            ",",
          )}. Proxy type should be Governance, Fellowship, Alliance, NonTransfer, or Any.`,
        );
        return;
      }

      const { result, error } = await nextApi.put("user/proxyaddress", {
        address: inputAddress,
      });
      if (result) {
        await fetchAndUpdateUser(userDispatch);
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
      const { result, error } = await nextApi.delete("user/proxyaddress");
      if (result) {
        await fetchAndUpdateUser(userDispatch);
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
    <div>
      <Label>Proxied Address</Label>
      <InputWrapper>
        <Input
          placeholder="Please fill address..."
          value={inputAddress}
          onChange={(e) => {
            setInputAddres(e.target.value);
          }}
          disabled={isSet}
        />
        <PrimaryButton
          onClick={isSet ? onUnset : onSet}
          disabled={disabled}
          isLoading={isLoading}
        >
          {isSet ? "Unset" : "Set"}
        </PrimaryButton>
      </InputWrapper>
      {errorMsg && <CustomErrorMessage>{errorMsg}</CustomErrorMessage>}
      {successMsg && <SuccessMessage>{successMsg}</SuccessMessage>}
    </div>
  );
}
