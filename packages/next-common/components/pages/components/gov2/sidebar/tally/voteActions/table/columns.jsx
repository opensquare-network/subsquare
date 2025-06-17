import AddressUser from "next-common/components/user/addressUser";

const accountColumn = {
  name: "Account",
  width: 120,
  render({ who }) {
    return <AddressUser key="user" add={who} />;
  },
};

// TODO: type
const actionColumn = {
  name: "Action",
  width: 200,
  className: "text-right",
  render({ type }) {
    return (
      <div>
        {type === 1 && (
          <span className="text-textPrimary text14Medium">Vote</span>
        )}
      </div>
    );
  },
};

// TODO: detail
const detailColumn = {
  name: "Detail",
  // width: 200,
  className: "text-right",
  render() {
    return <div>details</div>;
  },
};

// TODO: impact
const impactColumn = {
  name: "Impact",
  width: 160,
  className: "text-right",
  render() {
    return <div>+ 600 VOTES</div>;
  },
};

export const columns = [
  accountColumn,
  actionColumn,
  detailColumn,
  impactColumn,
];
