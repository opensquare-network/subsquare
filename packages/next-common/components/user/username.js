import { cn } from "next-common/utils";

export default function Username({
  username,
  fontSize,
  maxWidth,
  color,
  addressClassName = "",
}) {
  return (
    <div
      className={cn(
        "text14Medium !text-textPrimary",
        maxWidth ? "truncate" : "break-all",
        addressClassName,
      )}
      style={{
        fontSize,
        maxWidth,
        color,
      }}
    >
      {username}
    </div>
  );
}
