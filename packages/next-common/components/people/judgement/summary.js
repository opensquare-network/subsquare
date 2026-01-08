import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleSocialType } from "./consts";
import { SummaryGreyText } from "next-common/components/summary/styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Account from "next-common/components/account";
import LoadableContent from "next-common/components/common/loadableContent";

export default function JudgementSummary({ request, loading }) {
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
          <LoadableContent isLoading={loading}>
            <span>{verifiedSocials}</span>
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Pending">
          <LoadableContent isLoading={loading}>
            <span>{pendingSocials}</span>
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Total Socials">
          <LoadableContent isLoading={loading}>
            <span>
              {totalSocials}
              <SummaryGreyText> / {allSocialTypes.length}</SummaryGreyText>
            </span>
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </div>
  );
}
