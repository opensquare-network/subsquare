import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
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
  const { result: summary } = await backendApi.fetch("overview/summary");

  return {
    props: {
      summary: summary ?? {},
    },
  };
});
