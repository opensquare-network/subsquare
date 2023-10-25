export default function Notification() {
  return "Please visit `/settings/notifications`";
}

export const getServerSideProps = function () {
  return {
    redirect: {
      permanent: true,
      destination: "/settings/notifications",
    },
  };
};
