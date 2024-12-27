import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import nextApi from "next-common/services/nextApi";
import { setDemocracyDelegatesTriggerUpdate } from "next-common/store/reducers/democracy/delegates";
import { setReferendaDelegatesTriggerUpdate } from "next-common/store/reducers/referenda/delegates";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import EditorField from "next-common/components/popup/fields/editorField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import { getRealField } from "next-common/sima/actions/common";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

function PopupContent({ onClose, myDelegation, proxyAddress }) {
  const dispatch = useDispatch();
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const signMessage = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const signerAccount = useSignerAccount();

  const tab = useModuleTab();
  const module = tab === Referenda ? "referenda" : "democracy";

  useEffect(() => {
    if (!myDelegation) {
      return;
    }
    switch (myDelegation?.manifesto?.source) {
      case "nova":
      case "sima":
        setShortDescription(myDelegation?.manifesto?.shortDescription || "");
        setLongDescription(myDelegation?.manifesto?.longDescription || "");
        break;
      case "parity":
        setShortDescription(myDelegation?.manifesto?.manifesto || "");
        setLongDescription(myDelegation?.manifesto?.manifesto || "");
        break;
    }
  }, [myDelegation]);

  const triggerUpdate = useCallback(() => {
    if (module === "referenda") {
      dispatch(setReferendaDelegatesTriggerUpdate());
    } else if (module === "democracy") {
      dispatch(setDemocracyDelegatesTriggerUpdate());
    }
  }, [dispatch, module]);

  const handleSubmit = useCallback(async () => {
    if (!shortDescription) {
      dispatch(newErrorToast("Short description is required"));
      return;
    }

    setIsLoading(true);
    try {
      const entity = {
        action: "set-delegation-announcement",
        shortDescription,
        longDescription,
        timestamp: Date.now(),
        real: getRealField(proxyAddress),
      };
      const signerWallet = signerAccount.meta.source;
      const signature = await signMessage(
        JSON.stringify(entity),
        signerAccount.address,
        signerWallet,
      );
      const data = {
        entity,
        address: signerAccount.address,
        signature,
        signerWallet,
      };
      const { error } = await nextApi.post("delegation/announcements", data);
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      dispatch(newSuccessToast("Announcement published"));
      triggerUpdate();
      onClose();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    shortDescription,
    longDescription,
    signMessage,
    onClose,
    triggerUpdate,
    proxyAddress,
    signerAccount,
  ]);

  return (
    <>
      <TextInputField
        title="Short description"
        text={shortDescription}
        setText={setShortDescription}
      />
      <EditorField
        title="Long description"
        content={longDescription}
        setContent={setLongDescription}
      />
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={handleSubmit}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function AnnouncementPublishPopup({
  onClose,
  myDelegation,
  proxyAddress,
}) {
  return (
    <PopupWithSigner
      className="w-[800px] max-w-full"
      title="Publish Announcement"
      onClose={onClose}
      maskClosable={false}
    >
      <PopupContent
        myDelegation={myDelegation}
        proxyAddress={proxyAddress}
        onClose={onClose}
      />
    </PopupWithSigner>
  );
}
