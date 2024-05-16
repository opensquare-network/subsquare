import CheckSimaSpec from "next-common/components/checkSimaSpec";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";

function Content() {
  const { imageFile, onClose } = usePopupParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { uploading, upload } = useUploadToIpfs();
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    const { error, result } = await upload(imageFile);
    if (error) {
      dispatch(newErrorToast("Failed to save avatar to IPFS"));
      return;
    }
    const { cid } = result;
    return api.tx.system.remark(`SIMA:A:1:S:${cid}`);
  }, [api, dispatch]);

  const fnWaitSync = useWaitSyncBlock("Avatar published", () =>
    router.replace(router.asPath),
  );
  const onFinalized = (_, blockHash) => blockHash && fnWaitSync(blockHash);

  return (
    <>
      <CheckSimaSpec />
      <TxSubmissionButton
        title="Confirm"
        loading={uploading}
        loadingText={uploading ? "Saving..." : "Publishing..."}
        getTxFunc={getTxFunc}
        onClose={onClose}
        onFinalized={onFinalized}
      />
    </>
  );
}

export default function PublishAvatarPopup(props) {
  return (
    <PopupWithSigner title="Save & Publish" wide {...props}>
      <Content />
    </PopupWithSigner>
  );
}
