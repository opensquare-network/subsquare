import { ArrowExternalLinkWiki } from "@osn/icons/subsquare";
import AddressAvatar from "next-common/components/user/addressAvatar";
import IdentityInfo from "./identityInfo";
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

function PageTitle() {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="text16Bold text-textPrimary">New Application</span>
      <ArrowExternalLinkWiki className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
    </div>
  );
}

function BulletPoint({ className, children }) {
  return (
    <div className="flex items-center">
      <div className="w-[4px] h-[4px] bg-textSecondary rounded-full mx-[4px]"></div>
      <span className={className}>{children}</span>
    </div>
  );
}

function Info() {
  return (
    <div className="flex flex-col rounded-[8px] bg-neutral200 py-[10px] px-[16px] text14Medium text-textSecondary leading-[20px]">
      <span className="text14Bold">
        As a minimum, applicants need to provide the following information in
        their application:
      </span>
      <BulletPoint> Background information of the applicant</BulletPoint>
      <BulletPoint>
        Motivation(s) for applying to the Polkadot Technical Fellowship
      </BulletPoint>
      <BulletPoint>
        Area(s) of interest in relation to the Polkadot ecosystem.
      </BulletPoint>
      <BulletPoint> Contribution(s) to Polkadot SDK (if any)</BulletPoint>
      <BulletPoint> Link to the GitHub profile of the applicant</BulletPoint>
      <BulletPoint className="text-theme500">
        Polkadot address with a verified on-chain identity
      </BulletPoint>
      <span>
        Once an application is pre-approved, the applicant becomes eligible for
        induction to the Fellowship.
      </span>
    </div>
  );
}

function Applicant({ address }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text14Bold">Applicant</span>
      <div className="flex rounded-[8px] border border-neutral400 gap-[12px] p-[12px]">
        <AddressAvatar address={address} size={40} />
        <IdentityInfo address={address} />
      </div>
    </div>
  );
}

function ApplicationTitle({ creating, title, setTitle }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text14Bold">Title</span>
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
      <span className="text14Bold">Content</span>
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

export default function CreateFellowshipApplication() {
  const router = useRouter();
  const dispatch = useDispatch();
  const address = useRealAddress();
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
          applicant: address,
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
      <Applicant address={address} />
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
