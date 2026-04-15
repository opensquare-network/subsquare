import SecretaryMembersPage from "next-common/components/pages/secretary/members";
import getSecretaryMembersServerSideProps from "next-common/services/serverSide/secretary/members";

export default SecretaryMembersPage;

export const getServerSideProps = getSecretaryMembersServerSideProps;
