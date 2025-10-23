import BaseLayout from "next-common/components/layout/baseLayout";
import { useChainSettings } from "next-common/context/chain";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

function ValidatorsPageImpl() {
  const { description } = useChainSettings();
  return (
    <BaseLayout
      seoInfo={{ title: generateLayoutRawTitle("Validators") }}
      description={description}
    ></BaseLayout>
  );
}

export default function ValidatorsPage() {
  if (!isStakingSupported) {
    return null;
  }

  return <ValidatorsPageImpl />;
}

export const getServerSideProps = async (ctx) => {
  if (!isStakingSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
