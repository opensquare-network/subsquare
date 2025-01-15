import {
  SystemRadioButtonOff,
  SystemRadioButtonOn,
} from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { CID } from "multiformats";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import Editor from "next-common/components/editor";
import PopupLabel from "next-common/components/popup/label";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { cn } from "next-common/utils";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

function WishChoice({ title, description, checked, onClick = noop }) {
  return (
    <div
      className={cn(
        "flex grow py-[10px] pl-[16px] pr-[10px] rounded-[8px] border border-neutral400 gap-[10px]",
        "cursor-pointer",
      )}
      onClick={onClick}
    >
      <div className="flex flex-col grow">
        <span className="text14Medium text-textPrimary">{title}</span>
        <span className="text12Medium text-textTertiary">{description}</span>
      </div>
      <div>
        {checked ? (
          <SystemRadioButtonOn className="[&_path]:fill-theme500" />
        ) : (
          <SystemRadioButtonOff />
        )}
      </div>
    </div>
  );
}

function Content() {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const { component } = useSigner("Address");
  const [evidence, setEvidence] = useState("");
  const [wish, setWish] = useState("retention");
  const { uploading, upload } = useUploadToIpfs();
  const contextApi = useContextApi();
  const { api = contextApi } = usePopupParams();
  const pallet = useCoreFellowshipPallet();

  const getTxFunc = useCallback(async () => {
    const { error, result } = await upload(
      new File([evidence], `evidence-${address}-${wish}.txt`, {
        type: "text/plain",
      }),
      {
        errorMessage: "Failed to upload evidence to IPFS",
      },
    );
    if (error) {
      return;
    }
    const { cid } = result;

    let digest;
    try {
      digest = CID.parse(cid).toV0().multihash.digest;
    } catch (e) {
      dispatch(newErrorToast("Failed to parse CID digest"));
      return;
    }

    const hexDigest = "0x" + Buffer.from(digest).toString("hex");
    return api.tx[pallet]?.submitEvidence(wish, hexDigest);
  }, [upload, evidence, address, wish, api.tx, pallet, dispatch]);

  return (
    <>
      {component}
      <div>
        <PopupLabel
          text={
            <span>
              Wish <span className="text-red500">*</span>
            </span>
          }
        />
        <div className="flex gap-[8px]">
          <WishChoice
            title="Retention"
            description="Retain the current rank"
            checked={wish === "retention"}
            onClick={() => setWish("retention")}
          />
          <WishChoice
            title="Promotion"
            description="Promote to a higher rank"
            checked={wish === "promotion"}
            onClick={() => setWish("promotion")}
          />
        </div>
      </div>
      <div>
        <PopupLabel
          text={
            <span>
              Evidence <span className="text-red500">*</span>
            </span>
          }
        />
        <Editor
          value={evidence}
          onChange={setEvidence}
          contentType={"markdown"}
          minHeight={100}
        />
      </div>

      <TxSubmissionButton
        title="Save & Publish"
        loadingText={uploading ? "Uploading to IPFS..." : "Submitting..."}
        loading={uploading}
        getTxFunc={getTxFunc}
        api={api}
      />
    </>
  );
}

export default function SubmitEvidencePopup(props) {
  return (
    <PopupWithSigner title="Submit Evidence" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
