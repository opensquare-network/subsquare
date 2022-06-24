import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { isWeb3Injected, web3Enable } from "@polkadot/extension-dapp";
import Button from "./button";
import nextApi from "../services/nextApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  fetchUserProfile,
  userSelector,
} from "next-common/store/reducers/userSlice";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { nodes } from "next-common/utils/constants";
import Avatar from "./avatar";
import DownloadExtension from "./downloadExtension";
import { shadow_100 } from "../styles/componentCss";
import { addressEllipsis } from "../utils";
import { encodeAddressToChain } from "../services/address";
import { signMessage } from "../services/extension/signMessage";
import { polkadotWeb3Accounts } from "../utils/extensionAccount";
import AddressLinkIcon from "../assets/imgs/icons/address-link.svg";
import UnLinkIcon from "../assets/imgs/icons/unlink.svg";

const Wrapper = styled.div`
  max-width: 848px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const InfoWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  line-height: 150%;
  font-size: 14px;
  margin-bottom: 16px;
  color: #506176;
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
  border: 1px solid #e0e4eb;
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
      background: #f6f7fa;
      border-color: #f6f7fa;
    `}
`;

const NameWrapper = styled.div`
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: #9da9bb;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  font-size: 14px;
  color: #506176;
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
  border-bottom: 1px solid #ebeef4;
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
        background: #6848ff;
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
  color: #9da9bb;
`;

export default function LinkedAddress({ chain }) {
  const isMounted = useIsMounted();
  const user = useSelector(userSelector);
  const [hasExtension, setHasExtension] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [activeChain, setActiveChain] = useState(chain);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await web3Enable("subsquare");
      if (!isWeb3Injected) {
        if (isMounted.current) {
          setHasExtension(false);
        }
      }
    })();
  }, [isMounted]);

  const loadExtensionAddresses = async () => {
    await web3Enable("subsquare");
    if (!isWeb3Injected) {
      if (isMounted.current) {
        console.error("Polkadot Extension is not installed");
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
  };

  const unlinkAddress = async (chain, address) => {
    const { error, result } = await nextApi.delete(`user/linkaddr/${address}`);
    dispatch(fetchUserProfile());

    if (result) {
      dispatch(newSuccessToast("Unlink address successfully!"));
    }

    if (error) {
      dispatch(newErrorToast(error.message));
    }
  };

  const linkAddress = async (chain, address) => {
    const { result, error } = await nextApi.fetch(`user/linkaddr/${address}`);
    if (result) {
      let signature;

      try {
        signature = await signMessage(result?.challenge, address);
      } catch (e) {
        console.log("Sign request is cancelled");
        return;
      }

      const { error: confirmError, result: confirmResult } = await nextApi.post(
        `user/linkaddr/${result?.attemptId}`,
        { challengeAnswer: signature }
      );

      dispatch(fetchUserProfile());
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
    ...accounts,
    ...(user?.addresses || [])
      .filter((address) =>
        accounts.every(
          (acc) =>
            encodeAddressToChain(acc.address, activeChain) !== address.address
        )
      )
      .map((address) => ({
        address: address.address,
        name: "--",
      })),
  ];
  const availableAccounts = mergedAccounts || [];

  return (
    <Wrapper>
      <Title>Linked address</Title>
      <ContentWrapper>
        {hasExtension ? (
          <div>
            <InfoWrapper>{`Associate your account with an on-chain address using the Polkadot{.js} extension.`}</InfoWrapper>
            <Button secondary onClick={loadExtensionAddresses}>
              Show available accounts
            </Button>
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
                const activeChainAddress = encodeAddressToChain(
                  item.address,
                  activeChain
                );

                return (
                  <AddressItem
                    key={index}
                    linked={user?.addresses?.some(
                      (i) => i.address === activeChainAddress
                    )}
                  >
                    <Avatar address={activeChainAddress} size={32} />
                    <NameWrapper>
                      <div>{item.name}</div>
                      <div>{addressEllipsis(activeChainAddress)}</div>
                    </NameWrapper>
                    {user?.addresses?.some(
                      (i) => i.address === activeChainAddress
                    ) ? (
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
                          linkAddress(activeChain, activeChainAddress);
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
    </Wrapper>
  );
}
