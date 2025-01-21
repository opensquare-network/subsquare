import { isNil, startCase } from "lodash-es";
import Select from "next-common/components/select";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import { useRouter } from "next/router";

export default function FellowshipTrackSelect({ className = "" }) {
  const section = useCollectivesSection();
  const router = useRouter();
  const id = isNil(router.query.id) ? "" : Number(router.query.id);
  const { fellowshipTracksDetail } = usePageProps();

  const options = [
    {
      label: "All Tracks",
      value: "",
    },
    ...(fellowshipTracksDetail || []).map((track) => {
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
      optionsPadding="right"
      onChange={(item) => {
        router.push(
          item.value === ""
            ? `/${section}`
            : `/${section}/tracks/${item.value}`,
        );
      }}
      options={options}
    />
  );
}
