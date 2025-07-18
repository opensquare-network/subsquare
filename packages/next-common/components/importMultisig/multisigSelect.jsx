import { noop } from "lodash-es";
import Pagination from "../pagination";
import MultisigRadioGroup from "./multisigRadioGroup";
import PrimaryButton from "next-common/lib/button/primary";
import { cn } from "next-common/utils";

export default function MultisigSelect({
  list = [],
  selected,
  setSelected,
  onContinue,
  page = 1,
  setPage = noop,
  total = 0,
  pageSize = 10,
}) {
  const showPagination = total > pageSize;
  return (
    <>
      <div
        className={cn(
          "space-y-4  overflow-y-scroll scrollbar-pretty",
          showPagination
            ? "max-h-[calc(76vh-232px)]"
            : "max-h-[calc(76vh-180px)]",
        )}
      >
        <MultisigRadioGroup
          options={list}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      {showPagination && (
        <Pagination
          total={total}
          pageSize={pageSize}
          page={page}
          shallow
          onPageChange={(e, newPage) => {
            e.preventDefault();
            setPage(newPage);
          }}
        />
      )}
      <div className="flex items-center justify-end">
        <PrimaryButton disabled={!selected} onClick={onContinue}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}
