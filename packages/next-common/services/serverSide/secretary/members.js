import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { secretaryMembersApiUri } from "next-common/services/url";

const getSecretaryMembersServerSideProps = withCommonProps(async () => {
  const { result: secretaryMembers } = await backendApi.fetch(
    secretaryMembersApiUri,
  );

  return {
    props: {
      secretaryMembers: secretaryMembers ?? null,
    },
  };
});

export default getSecretaryMembersServerSideProps;
