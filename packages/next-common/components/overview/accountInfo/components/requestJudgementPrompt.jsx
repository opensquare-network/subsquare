import { CACHE_KEY } from "next-common/utils/constants";
import Prompt from "./prompt";
import Link from "next/link";
import { PromptTypes } from "next-common/components/scrollPrompt";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useRouter } from "next/router";

const judgementPage = "/people?tab=judgements";

export default function RequestJudgementPrompt() {
  const router = useRouter();
  const address = useRealAddress();
  const { hasIdentity, identity } = useIdentityInfo(address);
  const isJudgementPage = router.asPath?.startsWith(judgementPage);
  if (!hasIdentity || !identity || isJudgementPage) {
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
        <Link className="underline text14Medium" href={judgementPage}>
          here
        </Link>
        .
      </div>
    </Prompt>
  );
}
