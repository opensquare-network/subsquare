import ListLayout from "next-common/components/layout/ListLayout";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleGlobalProvider } from "../../index";
import { CHAIN } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import getChainSettings from "next-common/utils/consts/settings";
import PrimaryButton from "next-common/lib/button/primary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

export default function Page({ result }) {
  const address = useRealAddress();
  const [time, setTime] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (result?.success) {
      const timer = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            router.replace("/people/judgement");
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [result?.success, router]);
  return (
    <PeopleGlobalProvider>
      <ListLayout
        title="Subsquare Judgement Verify"
        seoInfo={{
          rawTitle: generateLayoutRawTitle("Subsquare verify your X account"),
        }}
        description={"Subsquare verify your X account"}
        headContent={
          <>
            <div className="pb-3 flex gap-2">
              <Account account={{ address }} addressClassName="!text14Medium" />
            </div>
          </>
        }
      >
        <div className=" bg-neutral100 border-b border-neutral300 p-4 rounded-lg  space-y-3">
          {result?.success ? (
            <p className=" text-center py-4 text-theme300  text14Medium">
              Verification successful! You will be redirected in {time} seconds…
            </p>
          ) : (
            <p className="text-center py-4 text-theme300  text14Medium">
              Verify Your X Account Failed
            </p>
          )}
          <div className="flex justify-end">
            <Link href="/people/judgement">
              <PrimaryButton>Go to Judgement Detail</PrimaryButton>
            </Link>
          </div>
        </div>
        <div className="pt-4 grid grid-cols-1  gap-4"></div>
      </ListLayout>
    </PeopleGlobalProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }
  const result = await getVerifyDetail(ctx.query.code);

  return withCommonProps(async () => {
    return {
      props: {
        result,
      },
    };
  })(ctx);
};

const getVerifyDetail = (code) => {
  code;
  // mocked data
  if (Math.round(Math.random() * 10) % 2 == 0) {
    return { success: true, message: "Verify success" };
  } else {
    return { success: false, message: "Verify error" };
  }
};
