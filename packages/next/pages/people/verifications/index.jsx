import { getPeopleServerSideProps } from "next-common/components/people/common/getServerSideProps";
import { CHAIN } from "next-common/utils/constants";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import getChainSettings from "next-common/utils/consts/settings";
import { PeopleGlobalProvider } from "..";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useRouter } from "next/router";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleOverviewPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/judgement"),
);

export default function VerificationPage() {
  const router = useRouter();
  const realAddress = useRealAddress();

  useEffect(() => {
    if (!realAddress) {
      const timer = setTimeout(() => {
        router.replace("/people");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [realAddress, router]);

  if (!realAddress) {
    return <div>Only connected users can access this page. redirecting...</div>;
  }

  return (
    <PeopleGlobalProvider>
      <PeopleOverviewPageImpl />
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
