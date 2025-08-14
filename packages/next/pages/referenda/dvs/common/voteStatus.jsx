import { cn } from "next-common/utils";

export default function VoteStatus({ status }) {
  let icon = null;
  if (status === "Nil") {
    icon = <span className="w-2 h-[2px] rounded-[2px] bg-neutral500"></span>;
  } else {
    icon = (
      <span
        className={cn("w-3 h-3 rounded-sm", {
          "bg-green300": status === "Aye",
          "bg-red300": status === "Nay",
          "bg-neutral500": status === "Abstain",
        })}
      ></span>
    );
  }
  return (
    <span className="inline-flex w-5 h-5 justify-center items-center">
      {icon}
    </span>
  );
}
