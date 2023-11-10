import Param from "./param";

export default function Params({ params }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {params.map((param) => (
        <Param key={param.name} {...param} />
      ))}
    </div>
  );
}
