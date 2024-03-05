import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

/**
 * @description a base layout frame
 */
export default function BaseLayoutFrame({ children, nav, header, footer }) {
  const { sm } = useScreenSize();
  const [navCollapsed] = useNavCollapsed();
  return (
    <div className="min-h-screen flex bg-pageBg max-sm:flex-col">
      <section className="sticky top-0 max-h-screen z-20">{nav}</section>

      <section
        className={cn(
          "flex flex-col flex-1",
          navCollapsed ? "max-w-[calc(100%-72px)]" : "max-w-[calc(100%-300px)]",
          "max-sm:max-w-full",
        )}
      >
        {!sm && <div className="sticky top-0 z-10 max-sm:hidden">{header}</div>}

        <section className="flex flex-col flex-1">{children}</section>

        <footer>{footer}</footer>
      </section>
    </div>
  );
}
