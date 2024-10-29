import { noop } from "lodash-es";
import SplitButton from "./splitButton";

function MenuItem({ icon, label, onClick = noop }) {
  return (
    <div
      className="flex items-center cursor-pointer hover:bg-neutral200 rounded-[6px]"
      onClick={onClick}
    >
      <div className="m-[8px]">{icon}</div>
      <div className="text14Medium text-textPrimary mr-[16px]">{label}</div>
    </div>
  );
}

function DropdownMenu({ items }) {
  return (
    <div className="px-[8px]">
      {items.map(({ icon, label, onClick }, index) => (
        <MenuItem key={index} icon={icon} label={label} onClick={onClick} />
      ))}
    </div>
  );
}

export default function SplitMenuButton({
  dropdownMenuItems = [],
  children,
  ...props
}) {
  return (
    <SplitButton
      {...props}
      dropdownContent={<DropdownMenu items={dropdownMenuItems} />}
    >
      {children}
    </SplitButton>
  );
}
