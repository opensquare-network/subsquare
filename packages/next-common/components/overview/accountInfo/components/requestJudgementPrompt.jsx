import { CACHE_KEY } from "next-common/utils/constants";
import Prompt from "./prompt";
import Link from "next/link";
import { PromptTypes } from "next-common/components/scrollPrompt";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";

const judgementPage = "/people?tab=judgements";

export default function RequestJudgementPrompt() {
  const address = useRealAddress();
  const { hasIdentity, identity } = useIdentityInfo(address);
  if (!hasIdentity || !identity) {
    return null;
  }

  const isNotVerified = identity.info?.status === "NOT_VERIFIED";
  if (!isNotVerified) {
    return null;
  }

  return (
    <Prompt
      cacheKey={CACHE_KEY.requestJudgementPrompt}
      type={PromptTypes.NEUTRAL}
    >
      <div>
        Your on-chain identity has not been verified yet, request registrar to
        judge it{" "}
        <Link className="underline text14Medium font-bold" href={judgementPage}>
          here
        </Link>
        .
      </div>
    </Prompt>
  );
}
