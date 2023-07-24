import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import nextApi from "../services/nextApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import {
  nodes,
  pageHomeLayoutMainContentWidth,
} from "next-common/utils/constants";
import Avatar from "./avatar";
import DownloadExtension from "./downloadExtension";
import { addressEllipsis, isSameAddress } from "../utils";
import { encodeAddressToChain } from "../services/address";
import AddressLinkIcon from "../assets/imgs/icons/address-link.svg";
import UnLinkIcon from "../assets/imgs/icons/unlink.svg";
import SecondaryButton from "./buttons/secondaryButton";
import { PrimaryCard } from "./styled/containers/primaryCard";
import { TitleContainer } from "./styled/containers/titleContainer";
import Popup from "./popup/wrapper/Popup";
import SelectWallet from "./wallet/selectWallet";
import { stringToHex } from "@polkadot/util";
import { getWallets } from "../utils/consts/connect";
import { fetchAndUpdateUser, useUser, useUserDispatch } from "../context/user";
import { useChain } from "../context/chain";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const ContentWrapper = styled(PrimaryCard)`
  input {
    background: var(--neutral100);
    border-color: var(--neutral400);
    color: var(--textPrimary);
  }
`;

const InfoWrapper = styled.div`
  background: var(--neutral200);
  border-radius: 4px;
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
      background: var(--neutral200);
      border-color: var(--neutral200);
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
        left: 8px;
        right: 8px;
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
  const [wallet, setWallet] = useState();
  const [showSelectWallet, setShowSelectWallet] = useState(false);
  const [selectedWallet, setSelectWallet] = useState("");
  const [hasExtension, setHasExtension] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [activeChain, setActiveChain] = useState(chain);
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();

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

  const unlinkAddress = async (chain, address) => {
    const { error, result } = await nextApi.delete(`user/linkaddr/${address}`);
    await fetchAndUpdateUser(userDispatch);

    if (result) {
      dispatch(newSuccessToast("Unlink address successfully!"));
    }

    if (error) {
      dispatch(newErrorToast(error.message));
    }
  };

  const linkAddress = async (chain, address, source) => {
    const { result, error } = await nextApi.fetch(`user/linkaddr/${address}`);
    if (result) {
      let signature;

      let injector = wallet;
      if (
        !getWallets().some(
          ({ extensionName }) => extensionName === selectedWallet,
        )
      ) {
        const extensionDapp = await import("@polkadot/extension-dapp");
        if (source) {
          injector = await extensionDapp.web3FromSource(source);
        } else {
          injector = await extensionDapp.web3FromAddress(address);
        }
      }

      try {
        const signResult = await injector.signer.signRaw({
          type: "bytes",
          data: stringToHex(result?.challenge),
          address,
        });
        signature = signResult.signature;
      } catch (e) {
        console.log("Sign request is cancelled");
        return;
      }

      const { error: confirmError, result: confirmResult } = await nextApi.post(
        `user/linkaddr/${result?.attemptId}`,
        { challengeAnswer: signature },
      );

      await fetchAndUpdateUser(userDispatch);
      if (confirmResult) {
        dispatch(newSuccessToast("Link address successfully!"));
      }

      if (confirmError) {
        dispatch(newErrorToast(confirmError.message));
      }
    }

    if (error) {
      dispatch(newErrorToast(error.message));
    }
  };

  const mergedAccounts = [
    ...(accounts ?? []),
    ...(user?.address ? [user?.address] : [])
      .filter((item) =>
        (accounts ?? []).every((acc) => !isSameAddress(acc.address, item)),
      )
      .map((address) => ({
        address,
        name: "--",
      })),
  ];
  const availableAccounts = mergedAccounts || [];

  return (
    <Wrapper>
      <TitleContainer>Linked address</TitleContainer>
      <ContentWrapper>
        {hasExtension ? (
          <div>
            <InfoWrapper>
              {
                "Associate your account with an on-chain address using the Polkadot{.js} extension."
              }
            </InfoWrapper>
            <SecondaryButton onClick={showSelectWalletModal}>
              Select wallet
            </SecondaryButton>
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

                return (
                  <AddressItem
                    key={index}
                    linked={isSameAddress(user?.address, activeChainAddress)}
                  >
                    <Avatar address={activeChainAddress} size={32} />
                    <NameWrapper>
                      <div>{item.name}</div>
                      <div>{addressEllipsis(activeChainAddress)}</div>
                    </NameWrapper>
                    {isSameAddress(user?.address, activeChainAddress) ? (
                      <LinkWrapper
                        onClick={() => {
                          unlinkAddress(activeChain, activeChainAddress);
                        }}
                      >
                        <AddressLinkIcon />
                        <div>Unlink</div>
                      </LinkWrapper>
                    ) : (
                      <LinkWrapper
                        onClick={() => {
                          linkAddress(
                            activeChain,
                            activeChainAddress,
                            item.meta?.source,
                          );
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
      </ContentWrapper>
      {showSelectWallet && (
        <Popup title="Select wallet" onClose={() => setShowSelectWallet(false)}>
          <SelectWallet
            selectedWallet={selectedWallet}
            setSelectWallet={setSelectWallet}
            onAccessGranted={() => {
              setShowSelectWallet(false);
            }}
            setAccounts={setAccounts}
            setWallet={setWallet}
          />
        </Popup>
      )}
    </Wrapper>
  );
}
