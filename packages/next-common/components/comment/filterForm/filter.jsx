import { SystemFilter } from "@osn/icons/subsquare";
import { omit } from "lodash-es";
import Checkbox from "next-common/components/checkbox";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { usePostCommentsFilterParams } from "next-common/hooks/usePostCommentsFilterParams";
import SecondaryButton from "next-common/lib/button/secondary";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

export default function CommentsFilterFormFilter() {
  const [params, , updateParams] = usePostCommentsFilterParams();
  const [value, setValue] = useState(omit(params, "comments_sort_by"));
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef();
  useClickAway(ref, () => {
    setShowFilter(false);
  });

  const counts = Object.values(params).filter((v) => v === true).length;

  const items = [
    {
      key: "hide_0",
      name: "Hide 0 balance accounts",
    },
    {
      key: "show_voters_only",
      name: "Show voter's comments only",
    },
    {
      key: "show_dv_only",
      name: "Show DV delegates only",
    },
    {
      key: "hide_deleted",
      name: "Hide [Deleted] comments",
    },
  ];

  function handleApply() {
    setShowFilter(false);
    updateParams(value);
  }

  return (
    <div ref={ref} className="relative">
      <SecondaryButton
        size="small"
        iconLeft={<SystemFilter className="w-4 h-4" />}
        onClick={() => {
          setShowFilter(!showFilter);
        }}
      >
        <span className="text-textSecondary">{counts}</span>
      </SecondaryButton>

      {showFilter && (
        <OptionWrapper className="absolute right-0 top-[calc(100%+10px)] bottom-auto text12Medium !w-auto z-10">
          {items.map((item) => (
            <div
              key={item.key}
              role="button"
              className="flex items-center gap-x-1 whitespace-nowrap py-1.5 select-none"
              onClick={() => {
                setValue({ ...value, [item.key]: !value[item.key] });
              }}
            >
              <Checkbox checked={value[item.key]} className="w-5 h-5" />
              <div>{item.name}</div>
            </div>
          ))}

          <div className="flex justify-end mt-2">
            <SecondaryButton size="small" onClick={handleApply}>
              Apply
            </SecondaryButton>
          </div>
        </OptionWrapper>
      )}
    </div>
  );
}
