import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleGlobalProvider } from "..";

export default function Page() {
  const address = useRealAddress();
  return (
    <PeopleGlobalProvider>
      <PeopleCommonProvider>
        <ListLayout
          title="Subsquare Judgement X Auth"
          seoInfo={{ rawTitle: generateLayoutRawTitle("Subsquare Judgement") }}
          description={"Subsquare judgement"}
          headContent={<ChainSocialLinks />}
        >
          <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg ">
            <div className="pb-3">
              <Account account={{ address }} addressClassName="!text14Medium" />
            </div>
          </div>
          <div className="pt-4 grid grid-cols-1  gap-4"></div>
        </ListLayout>
      </PeopleCommonProvider>
    </PeopleGlobalProvider>
  );
}
