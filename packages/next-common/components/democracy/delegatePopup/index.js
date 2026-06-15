import React, { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { noop } from "lodash-es";
import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";
import { checkInputValue, isSameAddress } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";
import { useChainSettings } from "next-common/context/chain";
import Conviction from "./conviction";
import VoteValue from "./voteValue";
import Target from "./target";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { normalizeAddress } from "next-common/utils/address";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent({ defaultTargetAddress, targetDisabled }) {
  const { onInBlock = noop } = usePopupParams();

  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const [targetAddress, setTargetAddress] = useState(
    normalizeAddress(defaultTargetAddress) || "",
  );

  const api = useContextApi();
  const node = useChainSettings();

  const { balance: votingBalance, isLoading: votingIsLoading } =
    useAddressVotingBalance(api, signerAccount?.realAddress);

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);

  const getTxFunc = useCallback(async () => {
    const bnVoteBalance = checkInputValue(
      inputVoteBalance,
      node.decimals,
      "vote balance",
    );

    if (bnVoteBalance.gt(votingBalance)) {
      throw new Error("Insufficient voting balance");
    }

    if (!targetAddress) {
      throw new Error("Please input a target address");
    }

    if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
      throw new Error(
        "Target address cannot be same with the delegator address",
      );
    }

    return api.tx.democracy.delegate(
      targetAddress,
      conviction,
      bnVoteBalance.toString(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVoteBalance, api, conviction, targetAddress, node.decimals]);

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        symbol={node.voteSymbol || node.symbol}
      />
      <Target
        disabled={targetDisabled}
        extensionAccounts={extensionAccounts}
        defaultAddress={targetAddress}
        setAddress={setTargetAddress}
      />
      <VoteValue
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction
        balance={inputVoteBalance}
        conviction={conviction}
        setConviction={setConviction}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton getTxFunc={getTxFunc} onInBlock={onInBlock} />
    </>
  );
}

export default function DelegatePopup({
  defaultTargetAddress,
  targetDisabled,
  ...props
}) {
  return (
    <PopupWithSigner title="Delegate" {...props}>
      <PopupContent
        defaultTargetAddress={defaultTargetAddress}
        targetDisabled={targetDisabled}
      />
    </PopupWithSigner>
  );
}
