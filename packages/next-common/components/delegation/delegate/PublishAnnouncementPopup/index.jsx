import { useCallback, useState } from "react";
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
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { sendTx } from "next-common/utils/sendTx";
import PopupLabel from "next-common/components/popup/label";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default function AnnouncementPublishPopup({
  title = "Publish",
  onClose,
  address,
}) {
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [isOrganization] = useState(false);
  const [, setLoading] = useState(false);
  const isMounted = useIsMounted();
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
  }, [dispatch, module]);

  const handleSubmit = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return;
      }

      try {
        const data = {
          isOrganization,
          shortDescription,
          longDescription,
        };
        const { result, error } = await nextApi.post(
          "delegation/publish-announcement",
          data,
        );
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }

        const { cid } = result;

        const delegation = "D";
        const version = 1;
        const publish = "P";
        const tx = api.tx.system.remark(
          `SIMA:${delegation}:${version}:${publish}:${cid}`,
        );

        await sendTx({
          tx,
          dispatch,
          setLoading,
          onInBlock: () => {
            // getMyVoteAndShowSuccessful();
          },
          signerAccount,
          isMounted,
          onClose,
        });

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
      shortDescription,
      longDescription,
      isOrganization,
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
          setContentType={() => {}}
          loadSuggestions={() => []}
          minHeight={100}
          previewerPlugins={[]}
          setQuillRef={() => {}}
        />
      </div>
      <div>
        <PopupLabel text="Long description" />
      </div>
    </SignerPopup>
  );
}
