import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";

import Button from "components/button";
import { useAuthPage, useIsMounted } from "utils/hooks";
import { userSelector } from "store/reducers/userSlice";
import {
  encodeKusamaAddress,
  encodePolkadotAddress,
  signMessage,
} from "services/chainApi";
import { addressEllipsis } from "utils";
import nextApi from "services/nextApi";
import { fetchUserProfile } from "store/reducers/userSlice";
import { addToast } from "store/reducers/toastSlice";

const Wrapper = styled.div`
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
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
  }
`;

const InfoWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  line-height: 150%;
  margin-bottom: 16px;
  color: #506176;
`;

const ExtensionLink = styled.a`
  display: block;
  color: #2196f3;
  text-decoration: underline;
  cursor: pointer;
`;

const Label = styled.div`
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 12px;
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 24px 0;
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
  > :last-child {
    margin-top: 4px;
    color: #9da9bb;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  color: #506176;
  cursor: pointer;
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

export default function LinkedAddress() {
  useAuthPage(true);
  const isMounted = useIsMounted();
  const user = useSelector(userSelector);
  const [hasExtension, setHasExtension] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [activeChain, setActiveChain] = useState("polkadot");
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
        name,
      };
    });

    if (isMounted.current) {
      setAccounts(accounts);
    }
  };

  const unlinkAddress = async (chain, account) => {
    const address = account[`${chain}Address`];

    const { error, result } = await nextApi.fetch(
      `user/linkaddr/${chain}/${address}`,
      {},
      {
        method: "DELETE",
      }
    );
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

    const { result, error } = await nextApi.fetch(
      `user/linkaddr/${chain}/${address}`
    );
    if (result) {
      const signature = await signMessage(result?.challenge, account.address);
      const { error: confirmError, result: confirmResult } =
        await nextApi.fetch(
          `user/linkaddr/${result?.attemptId}`,
          {},
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ challengeAnswer: signature }),
          }
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
      .filter(
        (address) =>
          !accounts.some((acc) => acc.address === address.wildcardAddress)
      )
      .map((address) => ({
        address: address.wildcardAddress,
        kusamaAddress: address.chain === "kusama" ? address.address : null,
        polkadotAddress: address.chain === "polkadot" ? address.address : null,
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
          <InfoWrapper>
            Polkadot-js extension not detected. No web3 account could be found.
            Visit this page on a computer with polkadot-js extension.
            <ExtensionLink
              href="https://polkadot.js.org/extension/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {`Download Polkadot{.js} extension`}
            </ExtensionLink>
          </InfoWrapper>
        )}
        <Divider />
        <div>
          <Label>Address</Label>
          <AddressWrapper>
            {availableAccounts.map((item, index) => (
              <AddressItem
                key={index}
                linked={user?.addresses?.some(
                  (i) => i.address === item[`${activeChain}Address`]
                )}
              >
                <img src="/imgs/icons/avatar.svg" />
                <NameWrapper>
                  <div>{item.name}</div>
                  <div>{addressEllipsis(item.address)}</div>
                </NameWrapper>
                {user?.addresses?.some(
                  (i) => i.address === item[`${activeChain}Address`]
                ) ? (
                  <LinkWrapper
                    onClick={() => {
                      unlinkAddress(activeChain, item);
                    }}
                  >
                    <img src="/imgs/icons/link-unlink.svg" />
                    <div>Unlink</div>
                  </LinkWrapper>
                ) : (
                  <LinkWrapper
                    onClick={() => {
                      linkAddress(activeChain, item);
                    }}
                  >
                    <img src="/imgs/icons/link-linked.svg" />
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
