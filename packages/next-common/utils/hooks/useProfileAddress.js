import { usePageProps } from "next-common/context/page";

export default function useProfileAddress() {
  const { id, user } = usePageProps();
  return user?.address || id;
}
