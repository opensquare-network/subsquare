import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";

export const indications = [
  { name: RELATIONSHIP_NODE_TYPE.Multisig, color: "var(--theme500)" },
  { name: RELATIONSHIP_NODE_TYPE.Proxy, color: "var(--green500)" },
  { name: RELATIONSHIP_NODE_TYPE.Identity, color: "var(--blue500)" },
];

export default function Indications() {
  return (
    <div className="flex justify-center gap-x-4">
      {indications.map((item, index) => (
        <div
          key={index}
          className="text-textSecondary text12Medium flex gap-x-2 items-center"
        >
          <span
            className="w-[0.625rem] border-b-2 inline-flex"
            style={{ borderColor: item.color }}
          ></span>
          {item.name}
        </div>
      ))}
    </div>
  );
}
