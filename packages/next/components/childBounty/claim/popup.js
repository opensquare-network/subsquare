import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import {
  emptyFunction,
  getNode,
  toPrecision,
} from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SignerSelect from "next-common/components/signerSelect";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  childBounty,
  chain,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState();
  const [claiming, setClaiming] = useState(false);
  const node = getNode(chain);

  useSetDefaultSigner(extensionAccounts, setSelectedAccount);

  const api = useApi(chain);

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

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!node) {
      return;
    }

    const tx = api.tx.childBounties.claimChildBounty(childBounty.parentBountyId, childBounty.index);

    const signerAddress = selectedAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: setClaiming,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  const showWarning = selectedAccount?.address !== childBounty?.beneficiary;
  const warningContent = showWarning && (
    <WarningMessage danger>Only beneficiary can claim rewards.</WarningMessage>
  );

  return (
    <>
      <div>
        <PopupLabelWithBalance
          text="Address"
          balanceName={"Balance"}
          balance={balance}
          isLoading={!balance}
          symbol={node.symbol}
        />
        <SignerSelect
          api={api}
          chain={chain}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          extensionAccounts={extensionAccounts}
        />
      </div>
      {warningContent}
      <ButtonWrapper>
        <SecondaryButton isLoading={claiming} onClick={doClaim}>
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Claim reward" Component={PopupContent} {...props} />;
}
