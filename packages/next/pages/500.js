import { Img404Dark, Img404Light } from "@osn/icons/subsquare";
import ErrorLayout from "next-common/components/layout/errorLayout";

export default function Page505() {
  return (
    <ErrorLayout
      icon={
        <>
          <Img404Light className="dark:hidden" />
          <Img404Dark className="hidden dark:block" />
        </>
      }
      title="500 Internal Server Error"
      description="The server encountered an error and could not complete your request"
    />
  );
}
