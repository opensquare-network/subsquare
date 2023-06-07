import { usePageProps } from "next-common/context/page";

export default function NavMenu() {
  const props = usePageProps();
  // eslint-disable-next-line
  const { tracks, fellowshipTracks } = props;

  return (
    <div>
      <ul>
        <li>
          <div>icon</div>
          <div>menu</div>
        </li>
      </ul>

      <hr className="h-[1px] bg-navigationBorder my-4 mx-3" />

      <ul>
        <li>
          <div>icon</div>
          <div>menu</div>
        </li>
      </ul>
    </div>
  );
}
