import { PeopleGlobalProvider } from "../../index";
import { CHAIN } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import getChainSettings from "next-common/utils/consts/settings";
import PeopleJudgementAuthCallbackPage from "next-common/components/pages/people/judgement/authCallback";
import { PeopleSocialType } from "next-common/components/people/judgement/consts";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

export default function Page({ code, state, error, errorDescription }) {
  return (
    <PeopleGlobalProvider>
      <PeopleJudgementAuthCallbackPage
        provider={PeopleSocialType.discord}
        providerLabel="Discord"
        backendCallbackPath="people/verifications/auth/discord/callback"
        code={code}
        state={state}
        error={error}
        errorDescription={errorDescription}
      />
    </PeopleGlobalProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  const code = ctx.query.code || "";
  const state = ctx.query.state || "";
  const error = ctx.query.error || "";
  const errorDescription = ctx.query.error_description || "";

  return withCommonProps(async () => {
    return {
      props: {
        code,
        state,
        error,
        errorDescription,
      },
    };
  })(ctx);
};
