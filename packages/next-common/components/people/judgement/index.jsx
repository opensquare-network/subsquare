import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Email from "./email";
import Discord from "./discord";
import Twitter from "./twitter";
import Github from "./github";
import Element from "./element";
import Loading from "next-common/components/loading";
import useMyJudgementRequest from "../hooks/useMyJudgementRequest";
import JudgementSummary from "./summary";

export const tabs = [
  {
    value: "Judgement",
    label: "Judgement",
    url: "/people/judgement",
    exactMatch: false,
  },
];

export default function JudgementPage() {
  const { value, loading: isLoadingMyJudgementRequest } =
    useMyJudgementRequest();

  const request = value?.items[0] || null;

  return (
    <PeopleCommonProvider>
      <ListLayout
        title="Subsquare Judgement"
        seoInfo={{ rawTitle: generateLayoutRawTitle("Subsquare Judgement") }}
        description={"Subsquare judgement"}
        headContent={<ChainSocialLinks />}
      >
        <JudgementSummary request={request} />
        <div className="pt-4 grid grid-cols-1 gap-4">
          {isLoadingMyJudgementRequest && !request ? (
            <div className="p-4 flex justify-center">
              <Loading size="24" />
            </div>
          ) : (
            <>
              {request?.info?.email && (
                <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                  <Email request={request} />
                </div>
              )}
              {request?.info?.element && (
                <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                  <Element />
                </div>
              )}
              {request?.info?.discord && (
                <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                  <Discord request={request} />
                </div>
              )}
              {request?.info?.twitter && (
                <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                  <Twitter request={request} />
                </div>
              )}
              {request?.info?.github && (
                <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                  <Github request={request} />
                </div>
              )}
            </>
          )}
        </div>
      </ListLayout>
    </PeopleCommonProvider>
  );
}
