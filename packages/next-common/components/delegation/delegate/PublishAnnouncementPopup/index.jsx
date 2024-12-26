import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import SignerPopup from "next-common/components/signerPopup";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import nextApi from "next-common/services/nextApi";
import { setDemocracyDelegatesTriggerUpdate } from "next-common/store/reducers/democracy/delegates";
import { setReferendaDelegatesTriggerUpdate } from "next-common/store/reducers/referenda/delegates";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import EditorField from "next-common/components/popup/fields/editorField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import { getRealField } from "next-common/sima/actions/common";

export default function AnnouncementPublishPopup({
  title = "Publish Announcement",
  onClose,
  myDelegation,
}) {
  const dispatch = useDispatch();
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const signMessage = useSignMessage();
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

  const handleSubmit = useCallback(
    async (signerAccount) => {
      if (!shortDescription) {
        dispatch(newErrorToast("Short description is required"));
        return;
      }

      let real;
      if (signerAccount.proxyAddress) {
        real = getRealField(signerAccount.proxyAddress);
      }

      try {
        const entity = {
          action: "set-delegation-announcement",
          shortDescription,
          longDescription,
          timestamp: Date.now(),
          real,
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
        triggerUpdate();
        onClose();
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [
      dispatch,
      shortDescription,
      longDescription,
      signMessage,
      onClose,
      triggerUpdate,
    ],
  );

  return (
    <SignerPopup
      className="w-[800px] max-w-full"
      title={title}
      onClose={onClose}
      actionCallback={handleSubmit}
      maskClosable={false}
    >
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
    </SignerPopup>
  );
}
