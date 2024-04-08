import PrimaryButton from "./primary";
import { SystemFilter } from "@osn/icons/subsquare";

export default function FilterButton(props) {
    return (
        <PrimaryButton
            {...props}
            iconLeft={<SystemFilter className="w-4 h-4"/>}
        >Filter</PrimaryButton>
    );
}
