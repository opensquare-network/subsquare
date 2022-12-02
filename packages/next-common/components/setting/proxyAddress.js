import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../input";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import { InputWrapper, Label } from "./styled";
import SecondaryButton from "../buttons/secondaryButton";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "../../context/user";
import { ErrorMessage } from "../styled/errorMessage";

export default function ProxyAddress() {
  const dispatch = useDispatch();
  const loginUser = useUser();
  const [inputAddress, setInputAddres] = useState(
    loginUser?.proxyAddress || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const userDispatch = useUserDispatch();
  const isSet = !!loginUser?.proxyAddress;

  useEffect(() => {
    setInputAddres(loginUser?.proxyAddress || "");
  }, [loginUser?.proxyAddress]);

  const onSet = async () => {
    setIsLoading(true);
    const { result, error } = await nextApi.put("user/proxyaddress", {
      address: inputAddress,
    });
    if (result) {
      fetchAndUpdateUser(userDispatch);
      dispatch(newSuccessToast("The proxy address has been set."));
    }
    if (error) {
      setErrorMsg(error.message);
    }
    setIsLoading(false);
  };

  const onUnset = async () => {
    setIsLoading(true);
    const { result, error } = await nextApi.delete("user/proxyaddress");
    if (result) {
      fetchAndUpdateUser(userDispatch);
      dispatch(newSuccessToast("The proxy address has been unset."));
    }
    if (error) {
      setErrorMsg(error.message);
    }
    setIsLoading(false);
  };

  const disabled = isLoading || !inputAddress;

  return (
    <div>
      <Label>Proxy Address</Label>
      <InputWrapper>
        <Input
          placeholder="Please fill address..."
          value={inputAddress}
          onChange={(e) => {
            setInputAddres(e.target.value);
          }}
          disabled={isSet}
        />
        <SecondaryButton onClick={isSet ? onUnset : onSet} disabled={disabled}>
          {isSet ? "Unset" : "Set"}
        </SecondaryButton>
      </InputWrapper>
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </div>
  );
}
