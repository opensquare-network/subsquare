import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import Input from "next-common/lib/input";
import { useEffect, useState } from "react";

export default function useSearchComponent(params) {
  const {
    isMyRelated = false,
    placeholder = "Search by identity name or address",
  } = params || {};

  const router = useRouter();
  const querySearch = getRouterQuery(router, "search");
  const [searchValue, setSearchValue] = useState(querySearch || "");

  useEffect(() => {
    if (isMyRelated) {
      setSearchValue("");
      removeRouterQuery(router, "search");
    }
  }, [isMyRelated, router]);

  const handleInputChange = (e) => {
    if (isMyRelated) return;
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      addRouterQuery(router, "search", value);
    } else {
      removeRouterQuery(router, "search");
    }
  };

  return {
    search: isMyRelated ? "" : searchValue,
    component: (
      <Input
        className="mt-4 mx-6"
        prefix={
          <SystemSearch width={24} height={24} className="text-textTertiary" />
        }
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        disabled={isMyRelated}
      />
    ),
  };
}
