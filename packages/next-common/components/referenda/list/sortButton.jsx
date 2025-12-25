import { ArrowUp, ArrowDown } from "@osn/icons/subsquare";
import Link from "next-common/components/link";
import { useRouter } from "next/router";
import { pickBy, omit } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useMemo } from "react";

export default function SortButton() {
  const router = useRouter();
  const sort = router.query?.sort || "";

  const query = useMemo(() => {
    const query = { ...router.query };
    query.page = 0;
    if (sort === "") {
      query.sort = "index_desc";
    } else if (sort === "index_desc") {
      query.sort = "";
    }

    return pickBy(omit(query, ["page"]), Boolean);
  }, [router.query, sort]);

  const tooltipText =
    sort === ""
      ? "Click to sort referenda by index descending"
      : "Click to clear sorting";

  return (
    <Tooltip content={tooltipText}>
      <Link
        href={{
          pathname: "/referenda",
          query: query,
        }}
        shallow
        onClick={(e) => {
          e.preventDefault();
          router.replace({ query });
        }}
      >
        <button
          size="small"
          className="h-7 w-7 flex overflow-hidden justify-center items-center bg-neutral100 border-neutral400 hover:border-neutral500 rounded-md border"
        >
          {sort === "index_desc" ? (
            <ArrowDown className="w-5 h-5 translate-y-0" />
          ) : (
            <div className="flex flex-col ">
              <ArrowDown className="w-5 h-5 translate-y-[70%]" />
              <ArrowUp className="w-5 h-5 -translate-y-[70%]" />
            </div>
          )}
        </button>
      </Link>
    </Tooltip>
  );
}
