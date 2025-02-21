import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import Input from "next-common/lib/input";

export default function useSearchComponent() {
  const router = useRouter();

  const querySearch = getRouterQuery(router, "search");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value) {
      addRouterQuery(router, "search", value);
    } else {
      removeRouterQuery(router, "search");
    }
  };

  return {
    search: querySearch,
    component: (
      <Input
        className="mt-4 mx-6"
        prefix={
          <SystemSearch width={24} height={24} className="text-textTertiary" />
        }
        placeholder="Search by identity name or address"
        defaultValue={querySearch || ""}
        onChange={handleInputChange}
      />
    ),
  };
}
