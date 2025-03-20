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
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useUploadToIpfs } from "next-common/hooks/useUploadToIpfs";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { cn } from "next-common/utils";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

// default Fellowship Evidence template
const fellowshipEvidenceTemplate = `# Argument-0000: Retention at/Promotion to Rank ____

## Member details
- Date of initial induction:
- Date of last report: 
- Area(s) of Expertise/Interest: 

## Reporting period
- Start date: YYYY/MM/DD
- End date: YYYY/MM/DD

## Argument
*Explain why your contributions in relation to the Polkadot SDK are worthy of retention/promotion. Refer to the terms in Section 6 of the [Manifesto](https://github.com/polkadot-fellows/manifesto/blob/main/manifesto.pdf) and provide links to relevant content (i.e code, articles, media, etc.) to show that you are meeting all the requirements.*

Below are some examples on how to write an argument for:
- Retention: [Rank 1](https://collectives.subsquare.io/fellowship/referenda/289), [Rank 2](https://collectives.subsquare.io/fellowship/referenda/282), [Rank 3](https://collectives.subsquare.io/fellowship/referenda/244)
- Promotion [Rank 1](https://collectives.subsquare.io/fellowship/referenda/272), [Rank 2](https://collectives.subsquare.io/fellowship/referenda/306), [Rank 3](https://collectives.subsquare.io/fellowship/referenda/255).

## Voting record
*Provide your voting record in relation to required thresholds for your rank.* 

|  Ranks | Activity thresholds | Agreement thresholds | Member's voting activities | Comments |
|---|---|---|---|---|
|III|70%   |100%  |I have voted on x out of xx referenda in which I was eligible to vote (i.e xx % voting activity). Out of xx referenda in which members of higher ranks were in complete agreement, I have voted in line with the consensus x times (i.e xx % voting agreement).  |*This is an example.* |
|I  |90%   |N/A   |   |  |
|II |80%   |N/A   |   |  |
|III|70%   |100%  |   |  |
|IV |60%   |90%   |   |  |
|V  |50%   |80%   |   |  |
|VI |40%   |70%   |   |  |

## Misc

- [ ] Question(s): 
- [ ] Concern(s): 
- [ ] Comment(s): `;

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
  const [template, setTemplate] = useState("");
  const { uploading, upload } = useUploadToIpfs();
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setTemplate(value);
    if (value === "fellowship") {
      setEvidence(fellowshipEvidenceTemplate);
    } else {
      setEvidence("");
    }
  };

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
        <div className="mb-2">
          <select
            value={template}
            onChange={handleTemplateChange}
            className="w-full p-2 border border-neutral400 rounded-[4px] text14Medium text-textPrimary"
          >
            <option value="">Use template (Optional)</option>
            <option value="fellowship">Fellowship Evidence Template</option>
          </select>
        </div>
        <Editor
          value={evidence}
          onChange={setEvidence}
          contentType={"markdown"}
          minHeight={300}
        />
      </div>

      <TxSubmissionButton
        title="Save & Publish"
        loadingText={uploading ? "Uploading to IPFS..." : "Submitting..."}
        loading={uploading}
        getTxFunc={getTxFunc}
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
