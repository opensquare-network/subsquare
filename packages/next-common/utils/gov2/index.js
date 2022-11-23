import capitalize from "../capitalize";

export const parseGov2TrackName = (name = "") =>
  name.split("_").map(capitalize).join(" ");
