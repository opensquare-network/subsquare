import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "../buttons/primaryButton";
import { CACHE_KEY } from "../../utils/constants";
import { useChain } from "../../context/chain";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import WalletAddressSelect from "./walletAddressSelect";
import getStorageAddressInfo from "next-common/utils/getStorageAddressInfo";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";
import { encodeAddressToChain } from "next-common/services/address";
import { loginRedirectUrlSelector } from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function AddressLogin({ setView }) {
  const chain = useChain();
  const [wallet, setWallet] = useState();
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const dispatch = useDispatch();
  const { closeLoginPopup } = useLoginPopup();
  const [lastLoginAddress, setLastLoginAddress] = useState();
  const { connect: connectWallet } = useConnectedWalletContext();
  const router = useRouter();
  const redirectUrl = useSelector(loginRedirectUrlSelector);

  useEffect(() => {
    const info = getStorageAddressInfo(CACHE_KEY.lastLoginAddress);
    if (info) {
      setLastLoginAddress(info);
    }
  }, []);

  const doWeb3Login = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    const address = encodeAddressToChain(selectedAccount.address, chain);
    connectWallet({
      address,
      wallet: selectedWallet,
      name: selectedAccount.name,
    });
    closeLoginPopup();
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="space-y-6">
      <WalletAddressSelect
        wallet={wallet}
        setWallet={setWallet}
        selectedWallet={selectedWallet}
        setSelectWallet={setSelectWallet}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        web3Error={web3Error}
        setWeb3Error={setWeb3Error}
        lastUsedAddress={lastLoginAddress?.address}
      />
      <ButtonWrapper>
        {selectedWallet && (
          <PrimaryButton
            isFill
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
