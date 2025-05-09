import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import IdentityIcon from "next-common/components/Identity/identityIcon";
import usePeopleChainIdentityInfo from "next-common/hooks/people/usePeopleChainIdentityInfo";
import LoadableContent from "next-common/components/common/loadableContent";

export function CommonIdentitiesSummaryCard({
  className = "",
  identityDetail,
  isLoading,
}) {
  const IdentityList = identityDetail
    ? [
        {
          identity: { info: { status: "VERIFIED" } },
          lanel: "Verified",
          count: identityDetail?.verifiedCount,
        },
        {
          identity: { info: { status: "NOT_VERIFIED" } },
          lanel: "Not verified",
          count: identityDetail?.unverifiedCount,
        },
        {
          identity: { info: { status: "ERRONEOUS" } },
          lanel: "Erroneous",
          count: identityDetail?.erroneousCount,
        },
      ]
    : [];

  return (
    <SummaryLayout className={className}>
      <SummaryItem title="Direct Identities">
        <LoadableContent isLoading={isLoading}>
          {identityDetail?.directCount}
        </LoadableContent>
        <div className="flex flex-col gap-y-0.5 mt-1">
          {IdentityList.map((item) => (
            <div
              key={item.identity.info.status}
              className="flex gap-x-2 items-center"
            >
              <IdentityIcon identity={item.identity} />
              <span className="text-textTertiary text12Medium">
                {item.lanel}
              </span>
              <span className="text-textPrimary text12Medium">
                <LoadableContent isLoading={isLoading}>
                  {item.count}
                </LoadableContent>
              </span>
            </div>
          ))}
        </div>
      </SummaryItem>
      <SummaryItem title="Sub Identities">
        <LoadableContent isLoading={isLoading}>
          {identityDetail?.subCount}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

export default function IdentitiesSummary({ className = "" }) {
  const { data: identityDetail, isLoading } = usePeopleChainIdentityInfo();

  return (
    <CommonIdentitiesSummaryCard
      className={className}
      identityDetail={identityDetail}
      isLoading={isLoading}
    />
  );
}
