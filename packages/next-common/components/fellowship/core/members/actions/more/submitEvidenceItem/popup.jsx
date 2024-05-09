import {
  SystemRadioButtonOff,
  SystemRadioButtonOn,
} from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import Editor from "next-common/components/editor";
import PopupLabel from "next-common/components/popup/label";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { cn } from "next-common/utils";
import { useCallback, useState } from "react";

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
      <div>{checked ? <SystemRadioButtonOn /> : <SystemRadioButtonOff />}</div>
    </div>
  );
}

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner("Address");
  const [evidence, setEvidence] = useState("");
  const [wish, setWish] = useState("retention");

  const api = useContextApi();

  const getTxFunc = useCallback(() => {}, [api]);

  return (
    <>
      {component}
      <div>
        <PopupLabel text="Wish *" />
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
        <PopupLabel text="Evidence *" />
        <Editor
          value={evidence}
          onChange={setEvidence}
          contentType={"markdown"}
          setContentType={() => {}}
          loadSuggestions={() => []}
          minHeight={100}
          previewerPlugins={[]}
          setQuillRef={() => {}}
        />
      </div>

      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function SubmitEvidencePopup(props) {
  return (
    <PopupWithSigner className="w-[640px]" title="Submit Evidence" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
