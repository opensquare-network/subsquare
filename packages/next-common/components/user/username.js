import { cn } from "next-common/utils";

export default function Username({ username, maxWidth }) {
  return (
    <div
      className={cn(maxWidth ? "truncate" : "break-all")}
      style={{
        maxWidth,
      }}
    >
      {username}
    </div>
  );
}
