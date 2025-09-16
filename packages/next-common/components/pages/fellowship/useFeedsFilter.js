import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";
import Input from "next-common/lib/input";
import { useCallback, useMemo } from "react";
import { omitBy, isNil } from "lodash-es";

const SECTION_CONTENTS = {
  referenda: "Referenda",
  membership: "Membership",
  salary: "Salary",
};

const ReferendaEventContents = {
  Voted: "Voted",
  Cancelled: "Cancelled",
  ConfirmAborted: "ConfirmAborted",
  ConfirmStarted: "ConfirmStarted",
  Confirmed: "Confirmed",
  DecisionDepositPlaced: "DecisionDepositPlaced",
  DecisionStarted: "DecisionStarted",
  Killed: "Killed",
  Executed: "Executed",
  Rejected: "Rejected",
  Submitted: "Submitted",
  TimedOut: "TimedOut",
};

const CoreEventContents = {
  ParamsChanged: "ParamsChanged",
  ActiveChanged: "ActiveChanged",
  Inducted: "Inducted",
  Offboarded: "Offboarded",
  Imported: "Imported",
  Promoted: "Promoted",
  Demoted: "Demoted",
  Proven: "Proven",
  Requested: "Requested",
  EvidenceJudged: "EvidenceJudged",
};

const SalaryEventContents = {
  CycleStarted: "CycleStarted",
  Inducted: "Inducted",
  Registered: "Registered",
  Paid: "Paid",
};

const SECTION_EVENT_CONTENTS = {
  referenda: ReferendaEventContents,
  membership: CoreEventContents,
  salary: SalaryEventContents,
};

function unshiftAll(options) {
  options.unshift({
    label: "All",
    value: null,
  });
  return options;
}

export default function useFeedsFilter() {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const sectionOptions = useMemo(
    () =>
      unshiftAll(
        Object.entries(SECTION_CONTENTS).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      ),
    [],
  );

  const eventOptions = useMemo(
    () =>
      unshiftAll(
        Object.entries(SECTION_EVENT_CONTENTS[stagedFilter?.section] || {}).map(
          ([key, value]) => ({
            label: value,
            value: key,
          }),
        ),
      ),
    [stagedFilter?.section],
  );

  const onFilterChange = useCallback(
    (state) => {
      const filteredState = omitBy(
        {
          ...state,
          page: 1,
        },
        isNil,
      );

      setStagedFilter(filteredState);
    },
    [setStagedFilter],
  );

  const component = (
    <DropdownFilter className="w-[320px]">
      <div className="flex flex-col gap-y-2">
        <div className="text12Medium text-textPrimary flex justify-between items-center gap-x-2">
          <div>Section</div>
          <Select
            className="w-48 text12Medium"
            small
            value={stagedFilter?.section || null}
            options={sectionOptions}
            onChange={(option) => {
              onFilterChange({
                ...stagedFilter,
                section: option.value,
                event: null,
              });
            }}
          />
        </div>
        <div className="text12Medium text-textPrimary flex justify-between items-center gap-x-2">
          <div>Event</div>
          <Select
            className="w-48 text12Medium"
            small
            value={stagedFilter?.event || null}
            options={eventOptions}
            onChange={(option) => {
              onFilterChange({ ...stagedFilter, event: option.value });
            }}
          />
        </div>
        <div className="text12Medium text-textPrimary flex justify-between items-center gap-x-2">
          <div>Who</div>
          <Input
            className="w-48 text12Medium"
            size="small"
            placeholder="Search address"
            value={stagedFilter?.who || null}
            onChange={(e) => {
              onFilterChange({
                ...stagedFilter,
                who: e.target.value || null,
              });
            }}
          />
        </div>
      </div>
    </DropdownFilter>
  );

  return {
    component,
  };
}
