import { SystemFilter } from "@osn/icons/subsquare";
import Checkbox from "next-common/components/checkbox";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import { usePostCommentsFilterParams } from "next-common/hooks/usePostCommentsFilterParams";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

export default function CommentsFilterFormFilter() {
  const api = useContextApi();

  const [params, , updateParams] = usePostCommentsFilterParams();
  const [value, setValue] = useState(params);
  useEffect(() => {
    setValue(params);
  }, [params]);

  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    setValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilter]);

  const ref = useRef();
  useClickAway(ref, () => {
    setShowFilter(false);
  });

  const counts = Object.values(params).filter((v) => v === true).length;

  const items = [
    {
      key: "hide_0",
      name: "Hide 0 balance accounts",
      disabled: !api,
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
            <Tooltip key={item.key} content={item.disabled && "Not available"}>
              <div
                className={cn(
                  "cursor-pointer flex items-center gap-x-1 whitespace-nowrap py-1.5 select-none",
                  item.disabled && "text-textDisabled cursor-default",
                )}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }

                  setValue({ ...value, [item.key]: !value[item.key] });
                }}
              >
                <Checkbox
                  checked={value[item.key]}
                  className="w-5 h-5 cursor-[inherit]"
                />
                <div className="cursor-[inherit]">{item.name}</div>
              </div>
            </Tooltip>
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
