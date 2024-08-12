import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
  useSetSigner,
} from "next-common/components/popupWithSigner/context";
import { useCallback, useState } from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import BalanceDisplay from "../balanceDisplay";
import { formatBalance } from "../assetsList";
import dynamic from "next/dynamic";
import ChainIcon from "next-common/components/header/chainIcon";
import Chains from "next-common/utils/consts/chains";
import { cn, isSameAddress, toPrecision } from "next-common/utils";
import { usePolkadotApi } from "next-common/context/polkadotApi";
import { useChainSettings } from "next-common/context/chain";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useMountedState } from "react-use";
import { sendSubstrateTx } from "next-common/utils/sendSubstrateTx";
import PrimaryButton from "next-common/lib/button/primary";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import BigNumber from "bignumber.js";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

function Chain({ title, chain, name }) {
  return (
    <div className="flex flex-col grow">
      <PopupLabel text={title} />
      <div
        className={cn(
          "flex border border-neutral400 bg-neutral200 rounded-[8px]",
          "p-[10px] items-center gap-[8px]",
          "text14Medium text-textPrimary",
        )}
      >
        <ChainIcon className="w-[24px] h-[24px]" chain={chain} />
        <span>{name}</span>
      </div>
    </div>
  );
}

const AssetHubParaId = 1000;

function PopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();

  const polkadotApi = usePolkadotApi();
  const setSigner = useSetSigner();

  const address = useRealAddress();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const [transferFromAddress, setTransferFromAddress] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const { decimals } = useChainSettings();

  const getTxFunc = useCallback(() => {
    if (!polkadotApi) {
      return;
    }

    if (!transferToAddress) {
      dispatch(newErrorToast("Please fill the address"));
      return;
    }

    if (!transferAmount) {
      dispatch(newErrorToast("Please fill the amount"));
      return;
    }

    const amount = new BigNumber(transferAmount)
      .times(Math.pow(10, decimals))
      .toFixed();

    const tx = polkadotApi.tx.xcmPallet.limitedTeleportAssets(
      {
        V3: {
          interior: {
            X1: {
              ParaChain: AssetHubParaId,
            },
          },
          parents: 0,
        },
      },
      {
        V3: {
          interior: {
            X1: {
              AccountId32: {
                id: api.createType("AccountId32", transferToAddress).toHex(),
                network: null,
              },
            },
          },
          parents: 0,
        },
      },
      {
        V3: [
          {
            fun: {
              Fungible: amount,
            },
            id: {
              Concrete: {
                interior: "Here",
                parents: 0,
              },
            },
          },
        ],
      },
      0,
      { Unlimited: null },
    );

    return tx;
  }, [dispatch, polkadotApi, address, transferToAddress, transferAmount]);

  const isMounted = useMountedState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = useCallback(async () => {
    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!transferFromAddress) {
      dispatch(newErrorToast("Signer account is not specified"));
      return;
    }

    let tx = await getTxFunc();
    if (!tx) {
      return;
    }

    const account = extensionAccounts.find((item) =>
      isSameAddress(item.address, transferFromAddress),
    );
    setSigner(polkadotApi, account);

    await sendSubstrateTx({
      api: polkadotApi,
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      signerAddress: transferFromAddress,
      isMounted,
      onClose,
      onInBlock: () => {
        dispatch(newSuccessToast("Teleport successful"));
      },
    });
  }, [
    polkadotApi,
    dispatch,
    extensionAccounts,
    transferFromAddress,
    getTxFunc,
    setSigner,
  ]);

  const balanceStatus = (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary">Transferable</span>
      <BalanceDisplay balance={formatBalance(0, 12)} />
    </div>
  );

  return (
    <>
      <div className="flex items-end gap-[12px]">
        <Chain title="Source Chain" chain={Chains.polkadot} name="Polkadot" />
        <div className="my-[3px] p-[8px] rounded-[8px] border border-neutral400 bg-neutral100">
          <SystemCrosschain width={24} height={24} />
        </div>
        <Chain
          title="Destination Chain"
          chain={Chains.polkadotAssetHub}
          name="Asset Hub"
        />
      </div>
      <div>
        <PopupLabel text="Amount" status={balanceStatus} />
        <Input
          type="text"
          placeholder="0.00"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value.replace("。", "."))}
          symbol={"DOT"}
        />
      </div>
      <AddressComboField
        title="From Address"
        extensionAccounts={extensionAccounts}
        setAddress={setTransferFromAddress}
        placeholder="Please fill the address or select another one..."
      />
      <AddressComboField
        title="To Address"
        extensionAccounts={extensionAccounts}
        setAddress={setTransferToAddress}
        placeholder="Please fill the address or select another one..."
      />
      <AdvanceSettings>
        <div>
          <PopupLabel text="Existential Deposit" />
          <Input
            disabled
            value={toPrecision(
              api?.consts.balances?.existentialDeposit || 0,
              decimals,
            )}
            symbol="DOT"
          />
        </div>
      </AdvanceSettings>
      <div className="flex justify-end">
        <PrimaryButton loading={isSubmitting} onClick={doSubmit}>
          Submit
        </PrimaryButton>
      </div>
    </>
  );
}

export function CrossChainTransferPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
