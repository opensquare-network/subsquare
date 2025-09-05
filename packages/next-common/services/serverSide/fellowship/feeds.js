import { withCommonProps } from "next-common/lib";

const getFellowshipFeedsServerSideProps = withCommonProps(async () => {
  return {
    props: {
      feeds: [],
    },
  };
});

export default getFellowshipFeedsServerSideProps;
