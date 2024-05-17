import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import nextApi from "../services/nextApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { nodes } from "next-common/utils/constants";
import Avatar from "./avatar";
import DownloadExtension from "./downloadExtension";
import { addressEllipsis, isSameAddress } from "../utils";
import { encodeAddressToChain } from "../services/address";
import AddressLinkIcon from "../assets/imgs/icons/address-link.svg";
import UnLinkIcon from "../assets/imgs/icons/unlink.svg";
import Popup from "./popup/wrapper/Popup";
import SelectWallet from "./wallet/selectWallet";
import { fetchAndUpdateUser, useUser, useUserContext } from "../context/user";
import { useChain } from "../context/chain";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import PrimaryButton from "next-common/lib/button/primary";
import { NeutralPanel } from "./styled/containers/neutralPanel";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { getSingleSigWallets } from "next-common/utils/consts/connect";
import { useAccounts } from "next-common/hooks/connect/substrate/useAccounts";

const InfoWrapper = styled.div`
  background: var(--neutral200);
  border-radius: 8px;
  padding: 12px 16px;
  line-height: 150%;
  font-size: 14px;
  margin-bottom: 16px;
  color: var(--textSecondary);
`;

const AddressWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const AddressItem = styled.div`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid var(--neutral400);
  border-radius: 4px;

  > :not(:first-child) {
    margin-left: 16px;
  }

  > img:first-child {
    width: 32px;
    height: 32px;
  }

  ${(p) =>
    p.linked &&
    css`
      background: var(--neutral100);
      border-color: var(--neutral400);
    `}
`;

const NameWrapper = styled.div`
  color: var(--textPrimary);
  flex-grow: 1;

  > :first-child {
    font-size: 14px;
  }

  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: var(--textTertiary);
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  font-size: 14px;
  color: var(--textSecondary);
  cursor: pointer;
  align-items: center;

  :hover {
    text-decoration: underline;
  }

  > svg {
    margin-right: 8px;
  }
`;

const NodesWrapper = styled.div`
  display: flex;
  margin: 24px 0;
  border-bottom: 1px solid var(--neutral300);

  > :not(:first-child) {
    margin-left: 24px;
  }
`;

const NodeItem = styled.div`
  color: var(--theme500);
  padding-bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  ${(p) =>
    p.selected &&
    css`
      ::after {
        content: "";
        background: var(--theme500);
        height: 3px;
        position: absolute;
        bottom: 0;
        left: 0px;
        right: 0px;
      }
    `}
`;

const EmptyList = styled.div`
  padding: 18px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: var(--textTertiary);
`;

export default function LinkedAddress() {
  const chain = useChain();
  const isMounted = useIsMounted();
  const user = useUser();
  const [showSelectWallet, setShowSelectWallet] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
  const [hasExtension, setHasExtension] = useState(true);
  const [activeChain, setActiveChain] = useState(chain);
  const dispatch = useDispatch();
  const userContext = useUserContext();
  const signMsg = useSignMessage();

  const addresses = useAccounts({ wallet: SelectWallet });

  useEffect(() => {
    if (typeof window.injectedWeb3 === "undefined") {
      setHasExtension(false);
      return;
    }
    if (Object.keys(window.injectedWeb3 ?? {}).length > 0) {
      setHasExtension(true);
    }
  }, [isMounted]);

  const showSelectWalletModal = () => setShowSelectWallet(true);

  const unlinkAddress = async (address) => {
    const { error, result } = await nextApi.delete(`user/linkaddr/${address}`);
    await fetchAndUpdateUser(userContext);

    if (result) {
      dispatch(newSuccessToast("Unlink address successfully!"));
    }

    if (error) {
      dispatch(newErrorToast(error.message));
    }
  };

  const linkAddress = async (address) => {
    const { result, error } = await nextApi.fetch(`user/linkaddr/${address}`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    let signature;
    try {
      signature = await signMsg(result?.challenge, address, selectedWallet);
    } catch (e) {
      console.error("Sign request is cancelled", e);
      return;
    }

    const { error: confirmError, result: confirmResult } = await nextApi.post(
      `user/linkaddr/${result?.attemptId}`,
      { challengeAnswer: signature, signer: selectedWallet },
    );

    if (confirmResult) {
      dispatch(newSuccessToast("Link address successfully!"));
      await fetchAndUpdateUser(userContext);
    }

    if (confirmError) {
      dispatch(newErrorToast(confirmError.message));
    }
  };

  const mergedAccounts = [
    ...(addresses ?? []),
    ...(user?.address ? [user?.address] : [])
      .filter((item) =>
        (addresses ?? []).every((acc) => !isSameAddress(acc.address, item)),
      )
      .map((address) => ({
        address,
        name: "--",
      })),
  ];
  const availableAccounts = mergedAccounts || [];

  return (
    <NeutralPanel className="p-6">
      {hasExtension ? (
        <div>
          <InfoWrapper>
            {
              "Associate your account with an on-chain address using the Polkadot{.js} extension."
            }
          </InfoWrapper>
          <PrimaryButton onClick={showSelectWalletModal}>
            Select wallet
          </PrimaryButton>
        </div>
      ) : (
        <DownloadExtension />
      )}
      <div>
        <NodesWrapper>
          {nodes
            .filter((node) => node.value === activeChain)
            .map((item, index) => (
              <NodeItem
                key={index}
                onClick={() => setActiveChain(item.value)}
                selected={item.value === activeChain}
              >
                {item.name}
              </NodeItem>
            ))}
        </NodesWrapper>
        <AddressWrapper>
          {availableAccounts.length === 0 && (
            <EmptyList>No available addresses</EmptyList>
          )}
          {availableAccounts.length > 0 &&
            availableAccounts.map((item, index) => {
              let activeChainAddress = item.address;
              if (isPolkadotAddress(item.address)) {
                activeChainAddress = encodeAddressToChain(
                  item.address,
                  activeChain,
                );
              }
              const maybeEvmAddress =
                tryConvertToEvmAddress(activeChainAddress);

              return (
                <AddressItem
                  key={index}
                  linked={isSameAddress(user?.address, activeChainAddress)}
                >
                  <Avatar address={maybeEvmAddress} size={32} />
                  <NameWrapper>
                    <div>{item.name}</div>
                    <div>{addressEllipsis(maybeEvmAddress)}</div>
                  </NameWrapper>
                  {isSameAddress(user?.address, activeChainAddress) ? (
                    <LinkWrapper
                      onClick={() => {
                        unlinkAddress(activeChainAddress);
                      }}
                    >
                      <AddressLinkIcon />
                      <div>Unlink</div>
                    </LinkWrapper>
                  ) : (
                    <LinkWrapper
                      onClick={() => {
                        linkAddress(activeChainAddress, item.meta?.source);
                      }}
                    >
                      <UnLinkIcon />
                      <div>Link</div>
                    </LinkWrapper>
                  )}
                </AddressItem>
              );
            })}
        </AddressWrapper>
      </div>
      {showSelectWallet && (
        <Popup
          className="w-[640px] p-[48px]"
          onClose={() => setShowSelectWallet(false)}
        >
          <h3 className="text20Bold text-textPrimary">
            <span>{"Select "}</span>
            <span className="text-theme500">Wallet</span>
          </h3>

          <SelectWallet
            wallets={getSingleSigWallets()}
            selectedWallet={selectedWallet}
            setSelectWallet={setSelectWallet}
            onSelect={() => setShowSelectWallet(false)}
          />
        </Popup>
      )}
    </NeutralPanel>
  );
}
