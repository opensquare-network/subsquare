import Select from "next-common/components/select";

export const SortByTrackIndex = 0;
export const SortByMostOngoingReferenda = 1;

const options = [
  {
    label: "Track Index",
    value: SortByTrackIndex,
  },
  {
    label: "Ongoing Referenda",
    value: SortByMostOngoingReferenda,
  },
].map(({ label, value }) => ({
  label: <span className="text12Medium">{label}</span>,
  value,
}));

export default function SortBySelect({ sortBy, setSortBy }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium">Sort by</span>
      <Select
        className="w-[165px]"
        small
        value={sortBy}
        options={options}
        onChange={({ value }) => setSortBy(value)}
      />
    </div>
  );
}
