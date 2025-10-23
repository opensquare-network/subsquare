import Gov2TrackTag from "next-common/components/gov2/trackTag";
import { useTrackName } from "../../track/trackTag";
import Link from "next/link";

export default function TrackTag({ id }) {
  const name = useTrackName(id);
  if (!name) {
    return null;
  }

  return (
    <Link key="track" className="inline-flex" href={`/referenda/tracks/${id}`}>
      <Gov2TrackTag name={name} id={id} />
    </Link>
  );
}
