import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

const TitleSuffix = ({ suffix, className }) => {
  if (isNil(suffix)) {
    return null;
  }

  return (
    <span className={cn("ml-1 text14Medium text-textTertiary", className)}>
      {suffix}
    </span>
  );
};

export default TitleSuffix;
