import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import AccountLayout from "next-common/components/layout/AccountLayout";
import Contacts from "next-common/components/contacts";

export default function MyContacts() {
  return (
    <AccountLayout>
      <Contacts />
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      summary: tracksProps.summary,
      ...tracksProps,
    },
  };
});
