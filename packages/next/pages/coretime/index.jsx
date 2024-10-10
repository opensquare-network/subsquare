import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";

export default function CoretimePage() {
  return <ListLayout title="Coretime">Page coretime</ListLayout>;
}

export const getServerSideProps = withCommonProps();
