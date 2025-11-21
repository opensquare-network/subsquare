import ListLayout from "next-common/components/layout/ListLayout";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleGlobalProvider } from "../../index";
import { CHAIN } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import getChainSettings from "next-common/utils/consts/settings";
import PrimaryButton from "next-common/lib/button/primary";
import KvList from "next-common/components/listInfo/kvList";
import Link from "next/link";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

export default function Page() {
  return (
    <PeopleGlobalProvider>
      <PageImpl />
    </PeopleGlobalProvider>
  );
}

function PageImpl() {
  const address = useRealAddress();
  return (
    <>
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
          <p className="text16Medium text-center">
            Verify Your X Account Successfully
          </p>
          <KvList
            data={[
              ["ID", "12345"],
              ["Display Name", "quinn"],
              ["Name", "Quinn"],
            ]}
          />
          <div className="flex justify-end">
            <Link href="/people/judgement">
              <PrimaryButton>Go to Judgement Detail</PrimaryButton>
            </Link>
          </div>
        </div>
        <div className="pt-4 grid grid-cols-1  gap-4"></div>
      </ListLayout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
