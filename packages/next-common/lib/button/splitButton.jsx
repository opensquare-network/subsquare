import { ArrowDown } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { cn } from "next-common/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function SplitButton({
  loading,
  disabled,
  dropdownContent,
  children,
  onClick,
  ...props
}) {
  if (loading) {
    return (
      <PrimaryButton loading={loading} {...props} onClick={onClick}>
        {children}
      </PrimaryButton>
    );
  }

  return (
    <div className="flex gap-[1px]">
      <PrimaryButton
        disabled={disabled}
        onClick={onClick}
        {...props}
        className="rounded-tr-none rounded-br-none"
      >
        {children}
      </PrimaryButton>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger disabled={disabled} asChild>
          <PrimaryButton
            disabled={disabled}
            {...props}
            className="rounded-tl-none rounded-bl-none p-[8px]"
          >
            <ArrowDown width={24} height={24} />
          </PrimaryButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              "z-[999999]",
              "min-w-[calc(100%+2px)] py-2 px-0",
              "shadow-200 rounded dark:border dark:border-neutral300",
              "whitespace-nowrap bg-neutral100 text-textPrimary",
            )}
            sideOffset={5}
          >
            <DropdownMenu.Item className="outline-none">
              {dropdownContent}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
