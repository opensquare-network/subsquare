import { useAsync } from "react-use";
import Loading from "next-common/components/loading";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import { fetchReferendumData } from "next-common/services/referendaData";

export default function LazyLoadableReferendumTitle({ referendumIndex }) {
  const { value, loading } = useAsync(async () => {
    return fetchReferendumData(referendumIndex);
  });

  if (loading) {
    return <Loading size={16} />;
  }
  if (!value) {
    return null;
  }
  const title = getGov2ReferendumTitle(value);
  return `#${referendumIndex} · ${title}`;
}
