import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Editor from "next-common/components/editor";
import InputText from "next-common/components/inputText";
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
import PopupLabel from "next-common/components/popup/label";
import { useUser } from "next-common/context/user";

export default function AnnouncementPublishPopup({
  title = "Publish Announcement",
  onClose,
  myDelegation,
}) {
  const user = useUser();
  const address = user?.address;
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [isLoading, setLoading] = useState(false);
  const signMessage = useSignMessage();
  const dispatch = useDispatch();
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
    async (api, signerAccount) => {
      if (!shortDescription) {
        dispatch(newErrorToast("Short description is required"));
        return;
      }

      try {
        setLoading(true);

        const entity = {
          shortDescription,
          longDescription,
          timestamp: Date.now(),
        };
        const signerWallet = signerAccount.meta.source;
        const signature = await signMessage(
          JSON.stringify(entity),
          address,
          signerWallet,
        );
        const data = {
          entity,
          address,
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
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      address,
      shortDescription,
      longDescription,
      signMessage,
      onClose,
      triggerUpdate,
    ],
  );

  return (
    <SignerPopup
      isLoading={isLoading}
      className="w-[800px] max-w-full"
      title={title}
      onClose={onClose}
      actionCallback={handleSubmit}
      maskClosable={false}
    >
      <div>
        <PopupLabel text="Short description" />
        <InputText value={shortDescription} setValue={setShortDescription} />
      </div>
      <div>
        <PopupLabel text="Long description" />
        <Editor
          value={longDescription}
          onChange={setLongDescription}
          contentType={"markdown"}
          minHeight={100}
        />
      </div>
    </SignerPopup>
  );
}
