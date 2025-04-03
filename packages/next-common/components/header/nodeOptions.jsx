import { cn } from "next-common/utils";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { useSelector } from "react-redux";
import {
  nodesSelector,
  setCurrentNode,
} from "next-common/store/reducers/nodeSlice";
import NodeSignalIcon from "./nodeSignalIcon";
import { useDispatch } from "react-redux";
import { noop } from "lodash-es";
import NodeSelectedIcon from "./nodeSelectedIcon";
export default function NodeOptions({
  small,
  currentNodeSetting,
  setShow = noop,
}) {
  const nodes = useSelector(nodesSelector);
  const dispatch = useDispatch();

  return (
    <NeutralPanel
      className={cn(
        "z-[1]",
        "absolute right-0",
        "mt-1 p-2",
        "text-textPrimary",
        "w-full",
        "border border-neutral300 !shadow-200 rounded-lg",
        small && "min-w-[192px] w-auto",
      )}
    >
      {nodes?.map?.((node, idx) => {
        const active = node.url === currentNodeSetting.url;

        return (
          <div
            key={idx}
            role="button"
            className={cn(
              "flex items-center justify-between",
              "min-w-[272px]",
              "py-1.5 px-2",
              "rounded-lg",
              "text-textPrimary text14Medium",
              "whitespace-nowrap",
              "hover:bg-neutral200",
              active && "bg-neutral200",
            )}
            onClick={() => {
              if (!active) {
                dispatch(setCurrentNode({ url: node.url }));
              }
              setShow(false);
            }}
          >
            <div className="flex items-center gap-x-2"> 
              <NodeSignalIcon delay={node?.delay} />
              <div>{node?.name}</div>
              <div className="text-textPrimary text12Medium text-textTertiary">
                {node?.delay && !isNaN(node?.delay) ? `${node.delay} ms` : ""}
              </div>
            </div>
            <NodeSelectedIcon className="ml-2" selected={active} />
          </div>
        );
      })}
    </NeutralPanel>
  );
}
