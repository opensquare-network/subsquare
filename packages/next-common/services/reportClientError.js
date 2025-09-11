import nextApi from "./nextApi";

export async function reportClientError(errorData) {
  await nextApi.post("client-errors", {
    msg_type: "text",
    content: {
      text: JSON.stringify(errorData, null, 2),
    },
  });
}
