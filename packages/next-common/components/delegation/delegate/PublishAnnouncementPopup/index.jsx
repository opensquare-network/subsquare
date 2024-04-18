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
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import PopupLabel from "next-common/components/popup/label";
import { useUser } from "next-common/context/user";
import Checkbox from "next-common/components/checkbox";
import {
  ProjectLogoSimaSpecDark,
  ProjectLogoSimaSpecLight,
} from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function AnnouncementPublishPopup({
  title = "Publish Announcement",
  onClose,
}) {
  const user = useUser();
  const address = user?.address;
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [isOrganization, setIsOrganization] = useState(false);
  const [isLoading, setLoading] = useState(false);
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
      try {
        setLoading(true);

        const entity = {
          isOrganization,
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
      isLoading={isLoading}
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
        <PopupLabel text="isOrganization" />
        <div
          className={cn(
            "flex justify-between items-center",
            "py-[10px] pl-[16px]",
            "text-textPrimary bg-neutral100",
            "rounded-[8px] border border-neutral400 ",
          )}
        >
          <span className="text-text14Medium">
            {"I'm a member of an organization"}
          </span>
          <Checkbox
            className={"mr-[10px]"}
            checked={isOrganization}
            onClick={() => setIsOrganization(!isOrganization)}
          />
        </div>
      </div>
      <div className="flex px-[16px] py-[10px] gap-[16px] bg-neutral200">
        <div>
          <ProjectLogoSimaSpecDark className="hidden dark:inline-block" />
          <ProjectLogoSimaSpecLight className="dark:hidden" />
        </div>
        <div className="flex flex-col">
          <span className="text14Medium text-textSecondary">
            You will submit a system#remark transaction to publish
            announcements.
          </span>
          <span className="text14Medium text-[#F7574F]">Check Sima Spec</span>
        </div>
      </div>
    </SignerPopup>
  );
}
