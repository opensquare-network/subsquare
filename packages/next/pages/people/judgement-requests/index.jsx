import { getPeopleServerSideProps } from "next-common/components/people/common/getServerSideProps";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import { useRouter } from "next/router";
import { useEffect } from "react";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const JudgementRequestsPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/judgementRequests"),
);

export default function PeopleJudgementRequestsPage() {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        router.replace("/people");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return <div>Only admins can access this page. redirecting...</div>;
  }

  return (
    <PeopleGlobalProvider>
      <JudgementRequestsPageImpl />
    </PeopleGlobalProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return await getPeopleServerSideProps(ctx);
};
