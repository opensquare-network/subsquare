import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import Input from "next-common/lib/input";
import { useEffect } from "react";

export default function useSearchComponent(params) {
  const {
    isMyRelated = false,
    placeholder = "Search by identity name or address",
  } = params || {};

  const router = useRouter();
  const querySearch = getRouterQuery(router, "search");

  useEffect(() => {
    if (isMyRelated) {
      removeRouterQuery(router, "search");
    }
  }, [isMyRelated, router]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value) {
      addRouterQuery(router, "search", value);
    } else {
      removeRouterQuery(router, "search");
    }
  };

  return {
    search: isMyRelated ? "" : querySearch,
    component: (
      <Input
        className="mt-4 mx-6"
        prefix={
          <SystemSearch width={24} height={24} className="text-textTertiary" />
        }
        placeholder={placeholder}
        value={querySearch || ""}
        onChange={handleInputChange}
        disabled={isMyRelated}
      />
    ),
  };
}
