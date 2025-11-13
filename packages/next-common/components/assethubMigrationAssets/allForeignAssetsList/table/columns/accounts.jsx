export const colAccounts = {
  name: "Accounts",
  style: { textAlign: "right", width: "120px", minWidth: "120px" },
  render: (item) => (
    <span key="accounts" className="text14Medium text-textPrimary">
      {item.accounts ? item.accounts.toLocaleString() : "--"}
    </span>
  ),
};
