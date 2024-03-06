import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";

export default function ReferendaPage() {
  const title = "Delegation";
  const desc = "No time to vote? Delegate your votes to an expert.";
  const seoInfo = { title, desc };

  return (
    <ListLayout seoInfo={seoInfo} title={title} description={seoInfo.desc}>
      todo: content here
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
