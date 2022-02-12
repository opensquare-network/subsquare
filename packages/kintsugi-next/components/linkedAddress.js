import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";
import Button from "next-common/components/button";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { userSelector } from "store/reducers/userSlice";
import {
  encodeKaruraAddress,
  encodeKhalaAddress,
  encodeKusamaAddress,
  encodePolkadotAddress,
  encodeSubstrateAddress,
  encodeBasiliskAddress,
  signMessage,
  encodeKabochaAddress,
  encodeBifrostAddress,
  encodeKintsugiAddress,
} from "services/chainApi";
import { addressEllipsis } from "utils";
import nextApi from "services/nextApi";
import { fetchUserProfile } from "store/reducers/userSlice";
import { addToast } from "store/reducers/toastSlice";
import { nodes } from "next-common/utils/constants";
import Avatar from "next-common/components/avatar";
import DownloadExtension from "next-common/components/downloadExtension";
import { shadow_100 } from "../styles/componentCss";

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
  > img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    filter: invert(37%) sepia(13%) saturate(941%) hue-rotate(173deg)
      brightness(92%) contrast(86%);
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
        return;
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
        kabochaAddress: encodeKabochaAddress(address),
        bifrostAddress: encodeBifrostAddress(address),
        kintsugiAddress: encodeKintsugiAddress(address),
        name,
      };
    });

    if (isMounted.current) {
      setAccounts(accounts);
    }
  };

  const unlinkAddress = async (chain, account) => {
    const address = account[`${chain}Address`];

    const { error, result } = await nextApi.delete(`user/linkaddr/${address}`);
    dispatch(fetchUserProfile());

    if (result) {
      dispatch(
        addToast({
          type: "success",
          message: "Unlink address successfully!",
        })
      );
    }

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: error.message,
        })
      );
    }
  };

  const linkAddress = async (chain, account) => {
    const address = account[`${chain}Address`];

    const { result, error } = await nextApi.fetch(`user/linkaddr/${address}`);
    if (result) {
      const signature = await signMessage(result?.challenge, account.address);
      const { error: confirmError, result: confirmResult } = await nextApi.post(
        `user/linkaddr/${result?.attemptId}`,
        { challengeAnswer: signature }
      );

      dispatch(fetchUserProfile());
      if (confirmResult) {
        dispatch(
          addToast({
            type: "success",
            message: "Link address successfully!",
          })
        );
      }

      if (confirmError) {
        dispatch(
          addToast({
            type: "error",
            message: confirmError.message,
          })
        );
      }
    }

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: error.message,
        })
      );
    }
  };

  const mergedAccounts = [
    ...accounts,
    ...(user?.addresses || [])
      .filter((address) =>
        accounts.every(
          (acc) => acc[`${address.chain}Address`] !== address.address
        )
      )
      .map((address) => ({
        address: encodeSubstrateAddress(address.address),
        kusamaAddress: address.chain === "kusama" ? address.address : null,
        polkadotAddress: address.chain === "polkadot" ? address.address : null,
        karuraAddress: address.chain === "karura" ? address.address : null,
        khalaAddress: address.chain === "khala" ? address.address : null,
        basiliskAddress: address.chain === "basilisk" ? address.address : null,
        kabochaAddress: address.chain === "kabocha" ? address.address : null,
        kintsugiAddress: address.chain === "kintsugi" ? address.address : null,
        name: "--",
      })),
  ];

  const availableAccounts =
    mergedAccounts?.filter((acc) => acc[`${activeChain}Address`]) || [];

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
              availableAccounts.map((item, index) => (
                <AddressItem
                  key={index}
                  linked={user?.addresses?.some(
                    (i) => i.address === item[`${activeChain}Address`]
                  )}
                >
                  {item[`${activeChain}Address`] ? (
                    <Avatar address={item[`${activeChain}Address`]} size={32} />
                  ) : (
                    <img alt="" src="/imgs/icons/avatar.svg" />
                  )}
                  <NameWrapper>
                    <div>{item.name}</div>
                    <div>{addressEllipsis(item[`${activeChain}Address`])}</div>
                  </NameWrapper>
                  {user?.addresses?.some(
                    (i) => i.address === item[`${activeChain}Address`]
                  ) ? (
                    <LinkWrapper
                      onClick={() => {
                        unlinkAddress(activeChain, item);
                      }}
                    >
                      <img alt="" src="/imgs/icons/link-unlink.svg" />
                      <div>Unlink</div>
                    </LinkWrapper>
                  ) : (
                    <LinkWrapper
                      onClick={() => {
                        linkAddress(activeChain, item);
                      }}
                    >
                      <img alt="" src="/imgs/icons/link-linked.svg" />
                      <div>Link</div>
                    </LinkWrapper>
                  )}
                </AddressItem>
              ))}
          </AddressWrapper>
        </div>
      </ContentWrapper>
    </Wrapper>
  );
}
