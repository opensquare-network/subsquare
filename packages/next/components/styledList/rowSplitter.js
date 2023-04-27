export default function RowSplitter({ backgroundColor, padding }) {
  return (
    <tr>
      <td colSpan="3" style={{ padding }}>
        <div style={{ height: "1px", backgroundColor }} />
      </td>
    </tr>
  );
}
