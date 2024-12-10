import TabsList from "next-common/components/tabs/list";

// maybe used for fellowship and ambassador
export default function FellowshipMemberTabs({
  membersCount,
  candidatesCount,
  section = "fellowship",
}) {
  const tabs = [
    {
      label({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Members
            </span>
            <span className="ml-1 text-textTertiary text14Medium">
              {membersCount}
            </span>
          </>
        );
      },
      url: `/${section}/core`,
    },
    {
      label({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Candidates
            </span>
            <span className="ml-1 text-textTertiary text14Medium">
              {candidatesCount}
            </span>
          </>
        );
      },
      url: `/${section}/core/candidates`,
    },
  ];

  return <TabsList tabs={tabs} className="px-6" />;
}
