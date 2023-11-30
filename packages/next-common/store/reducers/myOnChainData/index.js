import democracy from "./democracy";
import referenda from "./referenda";
import deposits from "./deposits";
import myAccount from "./account";

export default {
  ...democracy,
  ...referenda,
  ...deposits,
  myAccount,
};
