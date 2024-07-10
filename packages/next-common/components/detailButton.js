import { SystemMenu } from "@osn/icons/subsquare";
import ListButton from "./styled/listButton";

export default function DetailButton({ onClick, disabled }) {
  return (
    <ListButton disabled={disabled} onClick={onClick}>
      <SystemMenu width={16} height={16} />
    </ListButton>
  );
}
