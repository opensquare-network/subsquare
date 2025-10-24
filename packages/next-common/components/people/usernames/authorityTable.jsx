import { MapDataList } from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import useSearchIdentityAuthorityData from "./common/useSearchIdentityAuthorityData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function AuthorityTable() {
  const { component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Search name or address",
  });
  const { loading, data, total, pageComponent } =
    useSearchIdentityAuthorityData();

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <TitleContainer>
          <span className="inline-flex items-center">
            List
            <span className="text-textTertiary text16Medium ml-1">
              {!loading && total}
            </span>
          </span>
        </TitleContainer>
        <div>{SearchBoxComponent}</div>
      </div>
      <SecondaryCard className="space-y-2">
        <MapDataList
          data={data}
          columnsDef={columnsDef}
          loading={loading}
          noDataText="No authority"
        />
        {pageComponent}
      </SecondaryCard>
    </div>
  );
}

const columnsDef = [
  {
    name: "Account",
    render(item) {
      return <AddressUser add={item.accountId} />;
    },
  },
  {
    name: "User Name",
    width: 300,
    render(item) {
      return (
        <div
          key="name"
          className="max-w-[200px] sm:max-w-full break-all sm:break-normal whitespace-pre-wrap capitalize"
          title={item.username}
        >
          {item.username}
        </div>
      );
    },
  },
  {
    name: "Allocation",
    width: 160,
    className: "text-end",
    render(item) {
      return item.allocation;
    },
  },
];
