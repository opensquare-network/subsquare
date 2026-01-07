import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleSocialType } from "./consts";
import { SummaryGreyText } from "next-common/components/summary/styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Account from "next-common/components/account";

export default function JudgementSummary({ request }) {
  const address = useRealAddress();

  const allSocialTypes = Object.values(PeopleSocialType);
  const info = request?.info || {};
  const verification = request?.verification || {};
  const totalSocials = allSocialTypes.filter((key) =>
    Boolean(info[key]),
  ).length;
  const verifiedSocials = allSocialTypes.filter(
    (key) => Boolean(info[key]) && verification?.[key] === true,
  ).length;
  const pendingSocials = totalSocials - verifiedSocials;

  return (
    <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg ">
      <div className="pb-3 flex gap-2">
        <Account account={{ address }} addressClassName="!text14Medium" />
      </div>
      <SummaryLayout className="grid-cols-3">
        <SummaryItem title="Verified">
          <span>{verifiedSocials}</span>
        </SummaryItem>
        <SummaryItem title="Pending">
          <span>{pendingSocials}</span>
        </SummaryItem>
        <SummaryItem title="Total Socials">
          <span>
            {totalSocials}
            <SummaryGreyText> / {allSocialTypes.length}</SummaryGreyText>
          </span>
        </SummaryItem>
      </SummaryLayout>
    </div>
  );
}
