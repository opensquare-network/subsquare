import Editor from "next-common/components/editor";
import InputText from "next-common/components/inputText";
import SignerPopup from "next-common/components/signerPopup";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export default function AnnouncementEditPopup({ title = "Publish", onClose }) {
  const [announcement, setAnnouncement] = useState("");
  const [announcementContentType, setAnnouncementContentType] =
    useState("markdown");
  const [shortBio, setShortBio] = useState("");
  const signMessage = useSignMessage();
  const dispatch = useDispatch();

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
          signerAccount.address,
          signerAccount.meta.source,
        );

        //TODO: call server api
        onClose();
      } catch (e) {
        if (e.message === "Cancelled") {
          return;
        }
        dispatch(newErrorToast(e.message));
      }
    },
    [shortBio, announcement, announcementContentType, signMessage, onClose],
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
