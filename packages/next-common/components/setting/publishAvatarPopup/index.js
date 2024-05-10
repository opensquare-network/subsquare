import CheckSimaSpec from "next-common/components/checkSimaSpec";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { useCallback } from "react";

function Content() {
  const { imageFile, onClose } = usePopupParams();
  const { uploading, upload } = useUploadToIpfs();
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    const { error, result } = await upload(imageFile);
    if (!error) {
      return;
    }
    const { cid } = result;
    return api.tx.system.remark(`SIMA:A:1:S:${cid}`);
  }, [api]);

  return (
    <>
      <CheckSimaSpec />
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          loading={uploading}
          loadingText={uploading ? "Saving..." : "Publishing..."}
          getTxFunc={getTxFunc}
          onClick={onClose}
        />
      </div>
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
