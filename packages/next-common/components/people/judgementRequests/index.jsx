import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import JudgementRequestsList from "./list";

export default function JudgementRequestsPage() {
  return (
    <PeopleCommonProvider>
      <ListLayout
        title="Judgement Requests"
        seoInfo={{ rawTitle: generateLayoutRawTitle("Judgement Requests") }}
        description={"All pending identity judgement requests."}
        headContent={<ChainSocialLinks />}
      >
        <JudgementRequestsList />
      </ListLayout>
    </PeopleCommonProvider>
  );
}
