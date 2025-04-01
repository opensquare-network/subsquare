import { ArrowExternalLinkWiki } from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Input from "next-common/lib/input";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import Editor from "next-common/components/editor";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import AddressCombo from "next-common/components/addressCombo";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

function PageTitle() {
  return (
    <div className="flex gap-[8px] items-center">
      <h1 className="text16Bold text-textPrimary">New Application</h1>
      <ArrowExternalLinkWiki className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
    </div>
  );
}

function Info() {
  return (
    <div className="flex flex-col rounded-[8px] bg-neutral200 py-[10px] px-[16px] text14Medium text-textSecondary leading-[20px]">
      <p className="text14Bold">
        As a minimum, applicants need to provide the following information in
        their application:
      </p>
      <ul className="list-disc pl-[22px]">
        <li>Background information of the applicant</li>
        <li>Motivation(s) for applying to the Polkadot Technical Fellowship</li>
        <li>Area(s) of interest in relation to the Polkadot ecosystem.</li>
        <li>Contribution(s) to Polkadot SDK (if any)</li>
        <li>Link to the GitHub profile of the applicant</li>
        <li>
          <span className="text-theme500">
            Polkadot address with a verified on-chain identity
          </span>
        </li>
      </ul>
      <p>
        Once an application is pre-approved, the applicant becomes eligible for
        induction to the Fellowship.
      </p>
    </div>
  );
}

function Applicant({ address, setAddress }) {
  const extensionAccounts = useExtensionAccounts();

  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text14Bold">Applicant</h2>
      <AddressCombo
        className="!p-[12px] !h-auto !rounded-[8px]"
        address={address}
        setAddress={setAddress}
        accounts={extensionAccounts}
      />
    </div>
  );
}

function ApplicationTitle({ creating, title, setTitle }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text14Bold">Title</h2>
      <Input
        disabled={creating}
        placeholder="Please fill the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}

function ApplicationContent({
  content,
  contentType,
  setContent,
  setContentType,
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text14Bold">Content</h2>
      <Editor
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={300}
        setQuillRef={() => {}}
      />
    </div>
  );
}

function CreateFellowshipApplicationImpl() {
  const router = useRouter();
  const dispatch = useDispatch();
  const address = useRealAddress();
  const [applicantAddress, setApplicantAddress] = useState(address);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [loading, setLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const createApplication = async () => {
    setLoading(true);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.post(
        "fellowship/applications",
        {
          title,
          content,
          contentType,
          applicant: applicantAddress,
          proposer: address,
        },
        { credentials: "include" },
      );

      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      router.push(`/fellowship/applications/${result.applicationUid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <PageTitle />
      <Info />
      <Applicant address={applicantAddress} setAddress={setApplicantAddress} />
      <ApplicationTitle title={title} setTitle={setTitle} />
      <ApplicationContent
        content={content}
        contentType={contentType}
        setContent={setContent}
        setContentType={setContentType}
      />
      <div className="flex justify-end">
        <PrimaryButton loading={loading} onClick={createApplication}>
          Create
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function CreateFellowshipApplication() {
  return (
    <SignerPopupWrapper>
      <CreateFellowshipApplicationImpl />
    </SignerPopupWrapper>
  );
}
