import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import AuthoritySelect from "./common/authoritySelect";
import { MapDataList } from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import useSearchIdentityUsernameData from "./common/useSearchIdentityUsernameData";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

const columnsDef = [
  {
    name: "Username",
    render: (item) => (
      <div
        key="name"
        className="w-[200px] sm:w-full  text-end sm:text-start break-all sm:break-normal whitespace-pre-wrap truncate"
        title={item.username}
      >
        <span>{item.username}</span>
      </div>
    ),
  },
  {
    name: "Account",
    width: 300,
    render: (item) => <AddressUser add={item.owner} />,
  },
  {
    name: "Provider",
    width: 160,
    className: "text-end",
    render: (item) => item.provider,
  },
];

export default function UsernameTable() {
  const router = useRouter();
  const authority = getRouterQuery(router, "authority");
  const { component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Search username or account",
  });
  const { loading, data, total, pageComponent } =
    useSearchIdentityUsernameData();

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <TitleContainer className="h-7">
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
