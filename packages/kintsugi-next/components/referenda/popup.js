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
  // encodeAcalaAddress,
  encodeKabochaAddress,
  encodeKintsugiAddress,
} from "services/chainApi";

import {
  useOnClickOutside,
  useIsMounted,
  useApi,
  useAddressVotingBalance,
  useAddressVote,
} from "utils/hooks";
import AddressSelect from "components/addressSelect";
import Button from "next-common/components/button";
import { addToast } from "store/reducers/toastSlice";

import { getNode, toPrecision } from "utils";
import { useExtensionAccounts } from "utils/polkadotExtension";
import ExternalLink from "next-common/components/externalLink";
import ClosePanelIcon from "next-common/assets/imgs/icons/close-panel.svg";
import Input from "next-common/components/input";
// import Select from "components/select";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";
import Tooltip from "components/tooltip";
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
  color: #1e2134;
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
  > svg {
    cursor: pointer;
  }
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

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
  }
  > :not(:first-child) {
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

const StatusWrapper = styled.div`
  background: #ebeef4;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: #9da9bb;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    > svg {
      margin-left: 8px;
    }
  }
  > img {
    margin: 0 auto;
  }
  > div.no-data {
    font-size: 14px;
    line-height: 100%;
    color: #9da9bb;
    flex-grow: 1;
    text-align: center;
  }
`;

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default function Popup({
  chain,
  referendumIndex,
  onClose,
  onSubmitted = () => {},
  onFinalized = () => {},
  onInBlock = () => {},
}) {
  const dispatch = useDispatch();
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [
    extensionAccounts,
    hasExtension,
    isExtensionAccessible,
    extensionDetecting,
  ] = useExtensionAccounts("subsquare");
  const node = getNode(chain);
  const [isLoading, setIsLoading] = useState();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    selectedAccount?.address
  );
  const [addressVote, addressVoteIsLoading] = useAddressVote(
    referendumIndex,
    selectedAccount?.address
  );
  const [inputVoteBalance, setInputVoteBalance] = useState("0");

  useEffect(() => {
    if (extensionDetecting || !hasExtension || !isExtensionAccessible) {
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
      // acalaAddress: encodeAcalaAddress(address),
      kabochaAddress: encodeKabochaAddress(address),
      kintsugiAddress: encodeKintsugiAddress(address),
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

  const doVote = async (aye) => {
    if (isLoading || referendumIndex == null || !node) {
      return;
    }

    if (!inputVoteBalance) {
      dispatch(
        addToast({
          type: "error",
          message: "Please input vote balance",
        })
      );
      return;
    }

    let errorMessage = null;
    const decimals = node.decimals;
    const bnVoteBalance = new BigNumber(inputVoteBalance).multipliedBy(
      Math.pow(10, decimals)
    );

    if (bnVoteBalance.isNaN()) {
      errorMessage = { type: "error", message: "Invalid vote balance" };
    }

    if (bnVoteBalance.lte(0) || !bnVoteBalance.mod(1).isZero()) {
      errorMessage = { type: "error", message: "Invalid vote balance" };
    }

    if (!selectedAccount) {
      errorMessage = { type: "error", message: "Please select an account" };
    }

    if (!api) {
      errorMessage = {
        type: "error",
        message: "Chain network is not connected yet",
      };
    }

    if (errorMessage) {
      dispatch(addToast(errorMessage));
      return;
    }

    try {
      setIsLoading(aye ? "Aye" : "Nay");

      const voteAddress = selectedAccount.address;

      const unsub = await api.tx.democracy
        .vote(referendumIndex, { aye, balance: bnVoteBalance.toFixed() })
        .signAndSend(voteAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(voteAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            onInBlock(voteAddress);
          }
        })
        .then(() => onSubmitted(voteAddress));

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
      setIsLoading(null);
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
            <BalanceWrapper>
              <div>Voting Balance</div>
              {!votingIsLoading && <div>{votingBalance ?? 0}</div>}
              {votingIsLoading && <Loading />}
            </BalanceWrapper>
          </LabelWrapper>
          <AddressSelect
            chain={chain}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelect={(account) => {
              setSelectedAccount(account);
            }}
            disabled={isLoading}
          />
        </div>
        <div>
          <TooltipWrapper>
            <Label>Value</Label>
            <Tooltip content="The value is locked for the duration of the vote" />
          </TooltipWrapper>
          <Input
            type="number"
            placeholder="0"
            disabled={isLoading}
            value={inputVoteBalance}
            onChange={(e) => setInputVoteBalance(e.target.value)}
          />
        </div>
        <div>
          <TooltipWrapper>
            <Label>Voting status</Label>
            <Tooltip content="Resubmit the vote will overwrite the previous voting record" />
          </TooltipWrapper>
          <StatusWrapper>
            {!addressVoteIsLoading &&
              (addressVote ? (
                <>
                  <div className="value">
                    {toPrecision(addressVote.balance, node.decimals)}
                  </div>
                  {addressVote.aye ? (
                    <div className="result">
                      Aye
                      <ApproveIcon />
                    </div>
                  ) : (
                    <div className="result">
                      Nay
                      <RejectIcon />
                    </div>
                  )}
                </>
              ) : (
                <div className="no-data">No voting record</div>
              ))}
            {addressVoteIsLoading && <Loading size={14} />}
          </StatusWrapper>
        </div>
        <ButtonWrapper>
          <Button
            primary
            background="#4CAF50"
            onClick={() => doVote(true)}
            isLoading={isLoading === "Aye"}
            disabled={isLoading && isLoading !== "Aye"}
          >
            Aye
          </Button>
          <Button
            primary
            background="#F44336"
            onClick={() => doVote(false)}
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
          <div>Referenda vote</div>
          <ClosePanelIcon onClick={onClose} />
        </TopWrapper>
        {content}
      </Wrapper>
    </Background>
  );
}
