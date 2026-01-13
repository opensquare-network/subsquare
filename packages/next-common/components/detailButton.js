import { SystemMenu } from "@osn/icons/subsquare";
import ListButton from "./styled/listButton";

export default function DetailButton({ className, onClick, disabled }) {
  return (
    <ListButton
      role="button"
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <SystemMenu width={16} height={16} />
    </ListButton>
  );
}
