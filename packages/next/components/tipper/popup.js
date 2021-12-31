import styled, { css } from "styled-components";
import { useRef, useState, useEffect } from "react";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";
import {
  encodeKaruraAddress,
  encodeKhalaAddress,
  encodeKusamaAddress,
  encodePolkadotAddress,
  encodeBasiliskAddress,
} from "services/chainApi";

import { useOnClickOutside, useIsMounted } from "utils/hooks";
import AddressSelect from "components/addressSelect";
import Button from "components/button";
import TipInput from "./tipInput";

const Wrapper = styled.div`
  position: fixed;
  top: 260px;
  left: 50%;
  margin-top: 0 !important;
  width: 400px;
  padding: 24px;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
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
  ${(p) =>
    p.danger &&
    css`
      color: #f44336;
      background: #fff1f0;
    `}
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function Popup({ chain, councilTippers, onClose }) {
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());
  const isMounted = useIsMounted();
  const [accounts, setAccounts] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const [tipValue, setTipValue] = useState();

  const selectedAccountIsTipper = councilTippers.includes(selectedAccount?.[`${chain}Address`]);

  useEffect(() => {
    (async () => {
      await web3Enable("subsquare");
      if (!isWeb3Injected) {
        if (isMounted.current) {
          setHasExtension(false);
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
          name,
        };
      });

      if (isMounted.current) {
        setAccounts(accounts);
      }
    })();
  }, [isMounted]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
    setWeb3Error();
  }, [chain, accounts, selectedAccount]);

  const doEndorse = () => {
    //TODO: submit tip with the selected account
  };

  return (
    <Wrapper ref={ref}>
      <TopWrapper>
        <div>Tip</div>
        <img onClick={onClose} src="/imgs/icons/close.svg" alt="" />
      </TopWrapper>
      <Info danger={!selectedAccountIsTipper}>Only council members can tip.</Info>
      <div>
        <Label>Address</Label>
        <AddressSelect
          chain={chain}
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelect={(account) => {
            setSelectedAccount(account);
          }}
        />
      </div>
      <div>
        <Label>Tip Value</Label>
        <TipInput value={tipValue} setValue={setTipValue} />
      </div>
      <ButtonWrapper>
        {(selectedAccountIsTipper && tipValue) ? (
          <Button secondary onClick={doEndorse}>Endorse</Button>
        ) : (
          <Button disabled>Endorse</Button>
        )}

      </ButtonWrapper>
    </Wrapper>
  );
}
