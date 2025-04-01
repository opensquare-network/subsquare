import { indications } from "next-common/components/relationshipPopup/indications";

const generateArrowMarker = (id, color) => {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="8"
      markerHeight="6"
      orient="auto"
    >
      <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
    </marker>
  );
};

export const arrowMarker = (
  <svg>
    <defs>
      {indications.map((item) =>
        generateArrowMarker(
          "relationship_popup-arrow-" + item.name,
          item.color,
        ),
      )}
    </defs>
  </svg>
);
