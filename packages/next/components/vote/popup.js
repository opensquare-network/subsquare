import styled, { css } from "styled-components";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { web3FromAddress } from "@polkadot/extension-dapp";
import BigNumber from "bignumber.js";
import {
  encodeKaruraAddress,
  encodeKhalaAddress,
  encodeKusamaAddress,
  encodePolkadotAddress,
  encodeBasiliskAddress,
  encodeBifrostAddress,
  encodeAcalaAddress,
  encodeKabochaAddress,
} from "services/chainApi";

import { useOnClickOutside, useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import AddressSelect from "components/addressSelect";
import Button from "next-common/components/button";
import { addToast } from "store/reducers/toastSlice";

import { getNode, toPrecision } from "utils";
import { useExtensionAccounts } from "utils/polkadotExtension";
import ExternalLink from "next-common/components/externalLink";
import Loading from "./loading";

const Background = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.24);
  z-index: 999;
  top: 0;
  left: 0;
  margin-top: 0 !important;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 24px;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
    0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 6px;
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  > img {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`;

const Info = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  color: #506176;
  font-size: 14px;
  line-height: 140%;
  margin-top: 8px;
  ${(p) =>
    p.danger &&
    css`
      color: #f44336;
      background: #fff1f0;
    `}
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 12px 16px;
  background: #f6f7fa;
  border-radius: 4px;
  color: rgba(80, 97, 118, 1);
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
`;

const Download = styled.div`
  color: #2196f3;
`;

const CurrentVotingWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const CurrentVoting = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #1e2134;
  > :last-child {
    font-size: 12px;
    line-height: 100%;
    color: #506176;
    display: flex;
    align-items: center;
    > img {
      margin-left: 8px;
    }
  }
`;

const CurrentVotingNoData = styled(Message)`
  color: #9da9bb;
  display: block;
  text-align: center;
`;

const CurrentVotingLoading = styled.div`
  height: 38px;
  background: #f6f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  > first-child {
    background: #4caf50;
  }
  > * {
    flex-grow: 1;
  }
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

const balanceMap = new Map();

export default function Popup({
  chain,
  councilTippers,
  tipHash,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
}) {
  const dispatch = useDispatch();
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inputTipValue, setInputTipValue] = useState();
  const [tipping, setTipping] = useState(false);
  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState();
  const [
    extensionAccounts,
    hasExtension,
    isExtensionAccessible,
    extensionDetecting,
  ] = useExtensionAccounts("subsquare");
  const node = getNode(chain);

  const selectedAccountIsTipper = councilTippers.includes(
    selectedAccount?.[`${chain}Address`]
  );

  useEffect(() => {
    if (extensionDetecting) {
      return;
    }

    if (!hasExtension) {
      return;
    }

    if (!isExtensionAccessible) {
      return;
    }

    const accounts = extensionAccounts.map(({ address, meta: { name } }) => ({
      address,
      kusamaAddress: encodeKusamaAddress(address),
      polkadotAddress: encodePolkadotAddress(address),
      karuraAddress: encodeKaruraAddress(address),
      khalaAddress: encodeKhalaAddress(address),
      basiliskAddress: encodeBasiliskAddress(address),
      bifrostAddress: encodeBifrostAddress(address),
      acalaAddress: encodeAcalaAddress(address),
      kabochaAddress: encodeKabochaAddress(address),
      name,
    }));

    setAccounts(accounts);
  }, [
    extensionAccounts,
    hasExtension,
    isExtensionAccessible,
    extensionDetecting,
    isMounted,
  ]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [chain, accounts, selectedAccount]);

  const api = useApi(chain);

  useEffect(() => {
    if (api && selectedAccount) {
      web3FromAddress(selectedAccount.address).then((injector) => {
        if (isMounted.current) {
          api.setSigner(injector.signer);
        }
      });
    }
  }, [api, selectedAccount, isMounted]);

  useEffect(() => {
    if (balanceMap.has(selectedAccount?.address)) {
      setBalance(balanceMap.get(selectedAccount?.address));
      return;
    }
    setBalance();
    if (api && selectedAccount) {
      api.query.system.account(selectedAccount.address).then((result) => {
        if (isMounted.current) {
          const free = toPrecision(result.data.free, node.decimals);
          setBalance(free);
          balanceMap.set(selectedAccount.address, free);
        }
      });
    }
  }, [api, selectedAccount, node.decimals, isMounted]);

  const doEndorse = async () => {
    if (!api) {
      dispatch(
        addToast({
          type: "error",
          message: "Chain network is not connected yet",
        })
      );
      return;
    }

    if (!tipHash) {
      return;
    }

    if (!selectedAccount) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select an account",
        })
      );
      return;
    }

    if (!inputTipValue) {
      dispatch(
        addToast({
          type: "error",
          message: "Please input tip value",
        })
      );
      return;
    }

    const bnInputTipValue = new BigNumber(inputTipValue);
    if (bnInputTipValue.isNaN() || bnInputTipValue.lt(0)) {
      dispatch(
        addToast({
          type: "error",
          message: "Tip value is not valid",
        })
      );
      return;
    }

    if (!node) {
      return;
    }
    const decimals = node.decimals;

    const bnTipValue = bnInputTipValue.multipliedBy(Math.pow(10, decimals));
    if (!bnTipValue.mod(1).isZero()) {
      dispatch(
        addToast({
          type: "error",
          message: "Tip value is not valid",
        })
      );
      return;
    }

    try {
      setTipping(true);

      const tipperAddress = selectedAccount.address;

      const unsub = await api.tx.tips
        .tip(tipHash, bnTipValue.toFixed())
        .signAndSend(tipperAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(tipperAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            onInBlock(tipperAddress);
          }
        })
        .then(() => onSubmitted(tipperAddress));

      onClose();
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(
          addToast({
            type: "error",
            message: e.message,
          })
        );
      }
    } finally {
      setTipping(false);
    }
  };

  if (extensionDetecting) {
    return null;
  }

  let content;

  if (!hasExtension) {
    content = (
      <Message>
        <span>
          Polkadot-js extension not detected. No web3 account could be found.
          Visit this page on a computer with polkadot-js extension.
        </span>
        <ExternalLink href="https://polkadot.js.org/extension/">
          <Download>{"Download Polkadot{.js} extension"}</Download>
        </ExternalLink>
      </Message>
    );
  } else if (!isExtensionAccessible) {
    content = (
      <Message>
        Polkadot-js extension is detected but unaccessible, please go to
        Polkadot-js extension, settings, and check Manage Website Access
        section.
      </Message>
    );
  } else if (!accounts || accounts.length === 0) {
    content = (
      <Message>
        Polkadot-js extension is connected, but no account found. Please create
        or import some accounts first.
      </Message>
    );
  } else {
    content = (
      <>
        <div>
          <LabelWrapper>
            <Label>Address</Label>
          </LabelWrapper>
          <AddressSelect
            chain={chain}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelect={(account) => {
              setSelectedAccount(account);
            }}
          />
          <Info danger={!selectedAccountIsTipper}>
            Only council members can tip.
          </Info>
        </div>
        <CurrentVotingWrapper>
          <LabelWrapper>
            <Label>Current Voting</Label>
          </LabelWrapper>
          <CurrentVotingLoading>
            <Loading />
          </CurrentVotingLoading>
          <CurrentVotingNoData>No voting record</CurrentVotingNoData>
          <CurrentVoting>
            <div>Voting</div>
            {/* <div>
              Aye
              <img src="/imgs/icons/aye.svg" alt="" />
            </div> */}
            <div>
              Nay
              <img src="/imgs/icons/nay.svg" alt="" />
            </div>
          </CurrentVoting>
          <Message>
            Resubmitting the vote will override the current voting record
          </Message>
        </CurrentVotingWrapper>
        <ButtonWrapper>
          <Button
            primary
            background="#4CAF50"
            onClick={() => setIsLoading("Aye")}
            isLoading={isLoading === "Aye"}
            disabled={isLoading && isLoading !== "Aye"}
          >
            Aye
          </Button>
          <Button
            primary
            background="#F44336"
            onClick={() => setIsLoading("Nay")}
            isLoading={isLoading === "Nay"}
            disabled={isLoading && isLoading !== "Nay"}
          >
            Nay
          </Button>
        </ButtonWrapper>
      </>
    );
  }

  return (
    <Background>
      <Wrapper ref={ref}>
        <TopWrapper>
          <div>Vote</div>
          <img onClick={onClose} src="/imgs/icons/close.svg" alt="" />
        </TopWrapper>
        {content}
      </Wrapper>
    </Background>
  );
}
