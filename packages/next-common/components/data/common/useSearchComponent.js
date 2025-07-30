import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { useRouter } from "next/router";
import { SystemSearch } from "@osn/icons/subsquare";
import Input from "next-common/lib/input";
import { useEffect } from "react";
import { cn } from "next-common/utils";

export default function useSearchComponent(params) {
  const {
    isMyRelated = false,
    placeholder = "Search by identity name or address",
    className = "",
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
        className={cn("mt-4 mx-6", className)}
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
