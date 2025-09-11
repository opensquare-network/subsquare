import AllForeignAssetsList from "next-common/components/assets/allForeignAssetsList";
import { withCommonProps } from "next-common/lib";

export default function ForeignAssetsPage() {
  return <AllForeignAssetsList />;
}

export const getServerSideProps = withCommonProps(async () => {
  return {
    props: {},
  };
});
