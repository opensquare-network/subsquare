import nextApi from "./nextApi";

export async function reportError(errorData) {
  await nextApi.post("report-error", {
    msg_type: "text",
    content: {
      text: JSON.stringify(errorData, null, 2),
    },
  });
}
