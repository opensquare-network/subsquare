import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import DotNsWebIdsPageContent from "next-common/components/dotNsWebIds";

const isDotnsSupported = !!getChainSettings(CHAIN).dotns;

export default function DotNsWebIdsPage() {
  return isDotnsSupported ? <DotNsWebIdsPageContent /> : null;
}

export const getServerSideProps = async (context) => {
  if (!isDotnsSupported) {
    return { notFound: true };
  }
  return withCommonProps()(context);
};
