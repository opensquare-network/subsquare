import { isNil, startCase } from "lodash-es";
import Select from "next-common/components/select";
import { usePageProps } from "next-common/context/page";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { cn } from "next-common/utils";
import { useRouter } from "next/router";

export default function AmbassadorTrackSelect({ className = "" }) {
  const router = useRouter();
  const section = useCollectivesSection();

  const id = isNil(router.query.trackId) ? "" : Number(router.query.trackId);
  const { ambassadorTracksDetail } = usePageProps();
  const options = [
    {
      label: "All Tracks",
      value: "",
    },
    ...(ambassadorTracksDetail || []).map((track) => {
      return {
        label: `[${track.id}] ${startCase(track.name)}`,
        value: track.id,
      };
    }),
  ];

  return (
    <Select
      className={cn("[&_.select-option-wrapper]:w-56 !h-7", className)}
      search
      small
      value={id}
      maxDisplayItem={15}
      optionsPadding="right"
      onChange={(item) => {
        router.push(
          item.value === ""
            ? `/${section}/referenda`
            : `/ambassador/tracks/${item.value}`,
        );
      }}
      options={options}
    />
  );
}