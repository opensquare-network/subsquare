import Select from "next-common/components/select";
import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";
import { noop } from "lodash-es";
import { useMemo } from "react";
import { useChain } from "next-common/context/chain";
import { isPolkadotChain } from "next-common/utils/chain";

export default function ViewTypeSelect({ setViewType = noop, className = "" }) {
  const { viewType } = useRelationshipViewTypeState();
  const chain = useChain();

  const options = useMemo(() => {
    return [
      {
        label: "Common",
        value: VIEW_TYPE.COMMON,
      },
      {
        label: "Delegation",
        value: VIEW_TYPE.DELEGATION,
      },
      isPolkadotChain(chain)
        ? {
            label: "Transfer",
            value: VIEW_TYPE.TRANSFER,
          }
        : null,
    ].filter(Boolean);
  }, [chain]);

  return (
    <Select
      small
      className={className}
      options={options}
      value={viewType}
      onChange={(item) => setViewType(item.value)}
    />
  );
}
