import { LinkElement } from "@osn/icons/subsquare";

export default function ElementCardHeader({ tag, actions }) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div className="flex text16Bold">
          <LinkElement />
          <span className="text-textTertiary mx-1 ml-0">·</span>
          <h1>Element</h1>
        </div>
        <div>{tag}</div>
      </div>
      {actions}
    </div>
  );
}
