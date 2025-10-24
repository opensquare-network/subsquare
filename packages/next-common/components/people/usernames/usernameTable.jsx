import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import AuthoritySelect from "./common/authoritySelect";
import usePageDataFilter from "./common/usePageDataFilter";
import { MapDataList } from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import { useIdentityUsernameInfoOf } from "./common/useUsernameData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function UsernameTable() {
  const router = useRouter();
  const authority = getRouterQuery(router, "authority");
  const { component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Search username or address",
  });

  const { data: sourceData, loading: sourceLoading } =
    useIdentityUsernameInfoOf();
  const { loading, data, total, pageComponent } = usePageDataFilter(
    sourceData,
    sourceLoading,
  );

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
          <div>
            <AuthoritySelect
              value={authority}
              onChange={(value) => {
                if (value) {
                  addRouterQuery(router, "authority", value);
                } else {
                  removeRouterQuery(router, "authority");
                }
              }}
            />
          </div>
        </TitleContainer>
        <div>{SearchBoxComponent}</div>
      </div>
      <SecondaryCard className="space-y-2">
        <MapDataList
          data={data}
          columnsDef={columnsDef}
          loading={loading}
          noDataText="No usernames"
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
      return <AddressUser add={item.owner} />;
    },
  },
  {
    name: "User Name",
    width: 300,
    render(item) {
      return (
        <div
          key="name"
          className="w-[200px] sm:w-[300px] text-end sm:text-start break-all sm:break-normal whitespace-pre-wrap truncate"
          title={item.username}
        >
          <span>{item.username}</span>
        </div>
      );
    },
  },
  {
    name: "Provider",
    width: 160,
    className: "text-end",
    render(item) {
      return item.provider;
    },
  },
];
