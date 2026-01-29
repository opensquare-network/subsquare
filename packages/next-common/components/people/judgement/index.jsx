import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import NoWalletConnected from "next-common/components/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import JudgementPageContent from "./content";
import { JudgementContextProvider } from "./context";

export const tabs = [
  {
    value: "Judgement",
    label: "Judgement",
    url: "/people/judgement",
    exactMatch: false,
  },
];

export default function JudgementPage() {
  const realAddress = useRealAddress();

  return (
    <PeopleCommonProvider>
      <ListLayout
        title="Identity Judgement"
        seoInfo={{ rawTitle: generateLayoutRawTitle("Identity Judgement") }}
        description={"My identity judgement request."}
        headContent={<ChainSocialLinks />}
      >
        {!realAddress ? (
          <div className="h-full flex items-center justify-center">
            <NoWalletConnected text="Connect wallet to see your judgement request." />
          </div>
        ) : (
          <JudgementContextProvider>
            <JudgementPageContent />
          </JudgementContextProvider>
        )}
      </ListLayout>
    </PeopleCommonProvider>
  );
}
