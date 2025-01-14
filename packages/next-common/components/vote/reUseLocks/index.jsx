import AllLocks from "./allLocks";
import GovLocks from "./govLocks";

// TODO: set reuse locks into input
const ReUseLocks = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-2 max-sm:grid-cols-1">
      <GovLocks />
      <AllLocks />
    </div>
  );
};

export default ReUseLocks;
