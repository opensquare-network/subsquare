import capitalize from "./capitalize";

export const parseGov2Name = (name = "") =>
  name.split("_").map(capitalize).join(" ");
