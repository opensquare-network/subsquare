import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import IdentityIcon from "next-common/components/Identity/identityIcon";
import IdentitiesTable from "./table";
import usePeopleChainIdentityInfo from "next-common/hooks/people/usePeopleChainIdentityInfo";
import LoadableContent from "next-common/components/common/loadableContent";

export function PeopleIdentitiesPageImpl() {
  const { description } = useChainSettings();

  const tabs = [
    {
      value: "identities",
      label: "Identities",
      url: "/people/identities",
      exactMatch: false,
    },
  ];

  return (
    <ListLayout
      title="Identities"
      description={description}
      headContent={<ChainSocialLinks />}
      summary={<IdentitiesSummary />}
      tabs={tabs}
    >
      <div className="space-y-6">
        <IdentitiesTable />
      </div>
    </ListLayout>
  );
}

function IdentitiesSummary({ className = "" }) {
  const { data: identityDetail, isLoading } = usePeopleChainIdentityInfo();

  const IdentityList = identityDetail
    ? [
        {
          identity: { info: { status: "VERIFIED" } },
          lanel: "Verified",
          count: identityDetail?.directCount,
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
