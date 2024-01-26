import UrlTabs from "next-common/components/urlTabs";

export default function FellowshipMemberTabs({ members }) {
  const membersCount = (members || []).filter(
    (member) => member.rank > 0,
  ).length;
  const candidatesCount = (members || []).filter(
    (member) => member.rank <= 0,
  ).length;
  const tabs = [
    {
      label: "Members",
      render({ active }) {
        return (
          <span
            className={`text16Bold ${
              active ? "text-textPrimary" : "text-textTertiary"
            }`}
          >
            Members
          </span>
        );
      },
      url: "/fellowship/core",
      activeCount: membersCount,
    },
    {
      label: "Candidates",
      render({ active }) {
        return (
          <span
            className={`text16Bold ${
              active ? "text-textPrimary" : "text-textTertiary"
            }`}
          >
            Candidates
          </span>
        );
      },
      url: "/fellowship/core/candidates",
      activeCount: candidatesCount,
    },
  ];

  return <UrlTabs tabs={tabs} className="px-6 mb-4" />;
}
