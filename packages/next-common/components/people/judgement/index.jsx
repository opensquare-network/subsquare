import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import PeopleCommonProvider from "next-common/components/people/common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { SummaryGreyText } from "next-common/components/summary/styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Email from "./email";
import Discord from "./discord";
import Twitter from "./twitter";
import Github from "./github";
import Element from "./element";
import Loading from "next-common/components/loading";
import useMyJudgementRequest from "../hooks/useMyJudgementRequest";

export const tabs = [
  {
    value: "Judgement",
    label: "Judgement",
    url: "/people/judgement",
    exactMatch: false,
  },
];

export default function JudgementPage() {
  const address = useRealAddress();
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
        <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg ">
          <div className="pb-3 flex gap-2">
            <Account account={{ address }} addressClassName="!text14Medium" />
          </div>
          <SummaryLayout className="grid-cols-3">
            <SummaryItem title="Verified">
              <span>0</span>
            </SummaryItem>
            <SummaryItem title="Pending">
              <span>{0}</span>
            </SummaryItem>
            <SummaryItem title="TotalSocials">
              <span>
                {0}
                <SummaryGreyText> / {0}</SummaryGreyText>
              </span>
            </SummaryItem>
          </SummaryLayout>
        </div>
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
