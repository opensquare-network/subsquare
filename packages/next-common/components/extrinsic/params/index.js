import IndentPanel from "next-common/components/callTreeView/indentPanel";
import Param from "./param";

export default function Params({ params }) {
  if (!params) {
    return null;
  }

  return (
    <IndentPanel className="flex flex-col gap-[8px]">
      {params.map((param) => (
        <Param key={param.name} name={param?.name} def={param?.type} />
      ))}
    </IndentPanel>
  );
}
