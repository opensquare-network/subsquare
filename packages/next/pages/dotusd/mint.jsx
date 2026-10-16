import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import DotUsdMintRecords from "next-common/components/dotusd/mintRecords";

const isDotUsdSupported = !!getChainSettings(CHAIN).modules?.dotusd;

export default function DotUsdMintRecordsPage() {
  return isDotUsdSupported ? <DotUsdMintRecords /> : null;
}

export const getServerSideProps = async (context) => {
  if (!isDotUsdSupported) {
    return { notFound: true };
  }
  return withCommonProps()(context);
};
