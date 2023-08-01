import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import usePreimageHashs from "next-common/hooks/usePreimageHashs";

export default withLoginUserRedux(({ title }) => {
  const seoInfo = { title, desc: title };

  const hashs = usePreimageHashs();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title="Preimages"
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
    >
      <PreImagesList data={hashs} />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {
      title: "Preimages",
    },
  };
});
