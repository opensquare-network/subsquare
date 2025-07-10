import { noop } from "lodash-es";
import Pagination from "../pagination";
import MultisigRadioGroup from "./multisigRadioGroup";
import PrimaryButton from "next-common/lib/button/primary";

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
  return (
    <>
      <MultisigRadioGroup
        options={list}
        selected={selected}
        setSelected={setSelected}
      />
      {total > pageSize && (
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
