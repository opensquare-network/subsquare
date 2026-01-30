import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import NoWalletConnected from "next-common/components/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import JudgementPageContent from "./content";
import { JudgementContextProvider } from "./context";

export default function VerificationsPage() {
  const realAddress = useRealAddress();

  return (
    <PeopleCommonProvider>
      <ListLayout
        title="Identity social account verifications"
        seoInfo={{
          rawTitle: generateLayoutRawTitle(
            "Identity social account verifications",
          ),
        }}
        description={"My identity social account verifications."}
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
