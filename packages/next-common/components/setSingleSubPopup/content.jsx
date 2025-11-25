import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useExtensionAccounts,
  usePopupParams,
} from "../popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { noop, isEmpty } from "lodash-es";
import WindowSizeProvider from "next-common/context/windowSize";
import RightWrapper from "next-common/components/rightWraper";
import { SubItem } from "../setSubsPopup/subItem";
import { SubsDeposit } from "../setSubsPopup/content";

function useSingleSubAccountOptions(subs) {
  const extensionAccounts = useExtensionAccounts();
  const excludeAddresses = useMemo(() => {
    if (isEmpty(subs)) {
      return [];
    }

    return subs.map((sub) => sub[0]);
  }, [subs]);

  return useMemo(() => {
    return extensionAccounts?.map((item) => {
      item["disabled"] = excludeAddresses.includes(item.address);
      return item;
    });
  }, [excludeAddresses, extensionAccounts]);
}

export default function SetSingleSubPopupContent({ subs }) {
  const { address, currentName, retry = noop } = usePopupParams();
  const api = useContextApi();
  const dispatch = useDispatch();
  const options = useSingleSubAccountOptions(subs);

  const [sub, setSub] = useState({
    address: address || "",
    name: currentName || "",
  });

  useEffect(() => {
    if (address || currentName) {
      setSub({
        address: address || "",
        name: currentName || "",
      });
    }
  }, [address, currentName]);

  const updateSubField = useCallback((field, value) => {
    setSub((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submitIsDisabled = useMemo(() => {
    return !sub.address || !sub.name;
  }, [sub]);

  const singleSubAddress = useMemo(() => {
    return sub.address ? [sub.address] : [];
  }, [sub.address]);

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.identity || !sub.address || !sub.name) {
      return null;
    }

    return api.tx.identity.addSub(sub.address, { Raw: sub.name });
  }, [api, sub]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Sub identity added successfully"));
    retry?.();
  }, [dispatch, retry]);

  return (
    <WindowSizeProvider>
      <div className="space-y-4">
        <SignerWithBalance />

        <SubItem
          subId={0}
          sub={sub}
          selectedList={[sub.address]}
          updateSubField={updateSubField}
          onRemove={() => {}}
          extensionAccounts={options}
          showRemove={false}
        />

        <SubsDeposit selectedList={singleSubAddress} />

        <RightWrapper>
          <TxSubmissionButton
            disabled={submitIsDisabled}
            title="Submit"
            getTxFunc={getTxFunc}
            onInBlock={onInBlock}
          />
        </RightWrapper>
      </div>
    </WindowSizeProvider>
  );
}
