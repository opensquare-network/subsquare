export default function needCheckUtf8(section, method, argName) {
  if ("system" === section && ["remark", "remarkWithEvent"].includes(method)) {
    return true;
  }

  // For turing network
  if (
    "automationTime" === section &&
    "scheduleNotifyTask" === method &&
    "message" === argName
  ) {
    return true;
  }

  // For zeitgeist network
  if ("predictionMarkets" === section) {
    return ("rejectMarket" === method && "rejectReason" === argName) ||
      ("requestEdit" === method && "editReason" === argName)
  }

  return false;
}
