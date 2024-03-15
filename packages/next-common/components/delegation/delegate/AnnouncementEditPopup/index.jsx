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
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export default function AnnouncementEditPopup({
  title = "Publish",
  onClose,
  address,
}) {
  const [announcement, setAnnouncement] = useState("");
  const [announcementContentType, setAnnouncementContentType] =
    useState("markdown");
  const [shortBio, setShortBio] = useState("");
  const signMessage = useSignMessage();
  const dispatch = useDispatch();
  const tab = useModuleTab();
  const module = tab === Referenda ? "referenda" : "democracy";

  const triggerUpdate = useCallback(() => {
    if (module === "referenda") {
      dispatch(setReferendaDelegatesTriggerUpdate());
    } else if (module === "democracy") {
      dispatch(setDemocracyDelegatesTriggerUpdate());
    }
  }, [module]);

  const handleSubmit = useCallback(
    async (api, signerAccount) => {
      try {
        const data = {
          shortBio,
          announcement,
          announcementContentType,
        };
        data.signature = await signMessage(
          JSON.stringify(data),
          signerAccount.realAddress,
          signerAccount.meta.source,
        );
        data.signerWallet = signerAccount.meta.source;

        const { error } = await nextApi.post(
          `delegation/${module}/delegates/${address}/announcement`,
          data,
        );
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
        dispatch(newSuccessToast("Announcement published successfully"));
        triggerUpdate();
        onClose();
      } catch (e) {
        if (e.message === "Cancelled") {
          return;
        }
        dispatch(newErrorToast(e.message));
      }
    },
    [
      module,
      address,
      shortBio,
      announcement,
      announcementContentType,
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
    >
      <div className="flex flex-col gap-[8px]">
        <span className="text12Bold">Short Bio</span>
        <InputText value={shortBio} setValue={setShortBio} />
      </div>
      <div className="flex flex-col gap-[8px]">
        <span className="text12Bold">Announcement</span>
        <Editor
          value={announcement}
          onChange={setAnnouncement}
          contentType={announcementContentType}
          setContentType={setAnnouncementContentType}
          loadSuggestions={() => []}
          minHeight={100}
          previewerPlugins={[]}
          setQuillRef={() => {}}
        />
      </div>
    </SignerPopup>
  );
}
