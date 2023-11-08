import noop from "lodash.noop";

export default function TabsList({ tabs = [], onTabClick = noop }) {
  return (
    <ul className="flex space-x-6 overflow-x-auto scrollbar-hidden">
      {tabs.map((tab, idx) => {
        return (
          <li
            key={idx}
            role="button"
            className="cursor-pointer"
            onClick={() => onTabClick(tab)}
          >
            {tab.render ? tab.render() : tab.label}
          </li>
        );
      })}
    </ul>
  );
}
