import SplitButton from "./splitButton";
import { DropdownMenu } from "./splitDropdown";

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
