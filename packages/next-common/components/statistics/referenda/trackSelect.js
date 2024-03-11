import Select from "next-common/components/select";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import startCase from "lodash.startcase";

export default function TrackSelect({ selectedTrackId, setSelectedTrackId }) {
  const { tracks } = usePageProps();

  const options = useMemo(
    () => [
      { label: "All Tracks", value: "" },
      { divider: true },
      ...tracks.map((track) => ({
        label: (
          <span className="whitespace-nowrap">
            [{track.id}] {startCase(track.name)}
          </span>
        ),
        value: track.id.toString(),
      })),
    ],
    [tracks],
  );

  return (
    <Select
      className="w-[180px] !px-[12px] !py-[6px]"
      maxDisplayItem={6}
      options={options}
      value={selectedTrackId}
      onChange={({ value }) => setSelectedTrackId(value)}
      small
    />
  );
}
