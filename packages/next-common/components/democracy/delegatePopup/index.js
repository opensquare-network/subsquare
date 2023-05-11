import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, emptyFunction, isSameAddress } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useChainSettings } from "next-common/context/chain";
import Conviction from "./conviction";
import VoteValue from "./voteValue";
import Target from "./target";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSignerAccount from "../../../utils/hooks/useSignerAccount";
import { PopupButtonWrapper } from "../../popup/wrapper";
import { isNumber, objectSpread } from "@polkadot/util";

function makeSignOptions (api, partialOptions, extras) {
  return objectSpread(
    { blockHash: api.genesisHash, genesisHash: api.genesisHash },
    partialOptions,
    extras,
    { runtimeVersion: api.runtimeVersion, signedExtensions: api.registry.signedExtensions, version: api.extrinsicType },
  );
}

function makeEraOptions (api, registry, partialOptions, { header, mortalLength, nonce }) {
  if (!header) {
    if (partialOptions.era && !partialOptions.blockHash) {
      throw new Error("Expected blockHash to be passed alongside non-immortal era options");
    }

    if (isNumber(partialOptions.era)) {
      // since we have no header, it is immortal, remove any option overrides
      // so we only supply the genesisHash and no era to the construction
      delete partialOptions.era;
      delete partialOptions.blockHash;
    }

    return makeSignOptions(api, partialOptions, { nonce });
  }

  return makeSignOptions(api, partialOptions, {
    blockHash: header.hash,
    era: registry.createTypeUnsafe("ExtrinsicEra", [{
      current: header.number,
      period: partialOptions.era || mortalLength,
    }]),
    nonce,
  });
}

function PopupContent({
  extensionAccounts,
  onClose,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const signerAccount = useSignerAccount(extensionAccounts);

  const [targetAddress, setTargetAddress] = useState("");

  const api = useApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doDelegate = async () => {
    if (isLoading) {
      return;
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!targetAddress) {
      return showErrorToast("Please input a target address");
    }

    const signerAddress = signerAccount?.address;

    if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
      return showErrorToast(
        "Target address cannot be same with the delegator address",
      );
    }

    let tx = api.tx.democracy.delegate(
      targetAddress,
      conviction,
      bnVoteBalance.toString(),
    );

    // Test sign tx
    //----------------------------
    const info = await api.derive.tx.signingInfo(signerAddress);
    const header = info.header;
    const eraOptions = makeEraOptions(api, api.registry, {}, info);
    const payload = api.registry.createTypeUnsafe("SignerPayload", [objectSpread({}, eraOptions, {
      address: signerAddress,
      blockNumber: header ? header.number : 0,
      method: tx.method,
      version: tx.version,
    })]);

    const { web3FromSource } = await import("@polkadot/extension-dapp");
    const wallet = await web3FromSource("polkadot-js");
    console.log(payload.toPayload());
    const { signature } = await wallet.signer.signPayload(payload.toPayload());
    console.log({ signature });
    //----------------------------

    // eslint-disable-next-line no-constant-condition
    if (false) {
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      setIsLoading(true);
      await sendTx({
        tx,
        dispatch,
        setLoading: setIsLoading,
        onInBlock,
        onClose,
        signerAddress,
        isMounted,
      });
    }
  };

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
        symbol={node.voteSymbol || node.symbol}
      />
      <Target
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
      />
      <VoteValue
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction conviction={conviction} setConviction={setConviction} />
      <PopupButtonWrapper>
        <SecondaryButton isLoading={isLoading} onClick={doDelegate}>
          Confirm
        </SecondaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function DelegatePopup(props) {
  return (
    <PopupWithAddress
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      {...props}
    />
  );
}
