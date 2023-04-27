import { useThemeSetting } from "next-common/context/theme";
import RowSplitter from "./rowSplitter";
import { StyledTh } from "./styled";

export function Headers({ columns }) {
  const theme = useThemeSetting();

  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <StyledTh
            key={index}
            style={col.style}
            className={col.className}
            onClick={col.onClick}
          >
            {col.name}
          </StyledTh>
        ))}
      </tr>
      <RowSplitter
        backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"}
        padding={"16px 0 4px 0"}
      />
    </thead>
  );
}
