import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";

export default function FellowshipCorePage() {
  const title = "Fellowship Core";
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the Fellowship rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={[
        { label: "Members", url: "/fellowship/core" },
        { label: "Params", url: "/fellowship/core/params" },
      ].filter(Boolean)}
    >
      {/* todo: implement fellowship core members page */}
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
