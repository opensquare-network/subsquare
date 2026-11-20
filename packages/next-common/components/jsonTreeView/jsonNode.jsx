import { useState } from "react";
import IndentPanel from "next-common/components/papiCallTreeView/indentPanel";
import FoldButton from "next-common/components/papiCallTreeView/foldButton";
import {
  containerLabel,
  entriesOf,
  formatLeaf,
  getJsonKind,
  isContainerKind,
} from "./kind";

// Style of the value boxes in papiCallTreeView's ValueWrapper, so a JSON node reads like
// a call tree node.
const BOX_CLASS = "px-[16px] py-[8px] bg-neutral200 rounded-[4px]";

function NodeTitle({ name, type }) {
  return (
    <span className="truncate">
      {!!name && <span className="text-textTertiary">{`${name}: `}</span>}
      <span className="font-medium text-textPrimary">{type}</span>
    </span>
  );
}

function LeafNode({ name, type, text }) {
  return (
    <div className={`flex flex-col ${BOX_CLASS}`}>
      <span className="text-textTertiary truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <div className="text-textPrimary break-all whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function ContainerNode({ name, kind, entries }) {
  const [folded, setFolded] = useState(false);

  return (
    <div className="flex flex-col">
      <div className={`flex items-center justify-between gap-x-2 ${BOX_CLASS}`}>
        <NodeTitle name={name} type={containerLabel(kind, entries.length)} />
        <FoldButton folded={folded} setFolded={setFolded} />
      </div>
      {!folded && (
        <IndentPanel className="gap-[8px]">
          {entries.map(([key, item]) => (
            <JsonNode key={key} name={key} value={item} />
          ))}
        </IndentPanel>
      )}
    </div>
  );
}

export default function JsonNode({ name, value }) {
  const kind = getJsonKind(value);

  if (isContainerKind(kind)) {
    const entries = entriesOf(value);

    if (entries.length) {
      return <ContainerNode name={name} kind={kind} entries={entries} />;
    }
  }

  return <LeafNode name={name} type={kind} text={formatLeaf(value)} />;
}
