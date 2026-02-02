import {
  ArrowRight,
  MenuCouncil,
  MenuAuthorities,
  MenuData,
  MenuRegistrars,
  InfoUsers,
  MenuJudgements,
  MenuIdentity,
} from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export function getPeopleMenu({ isAdmin, hasActiveJudgementRequest } = {}) {
  return {
    name: "People",
    value: "people",
    pathname: "/people",
    icon: <MenuCouncil />,
    extra: <ArrowRight className="text-navigationTextTertiary" />,
    type: NAV_MENU_TYPE.subspace,
    items: [
      {
        name: "Overview",
        value: "overview",
        pathname: "/people",
        icon: <MenuAuthorities />,
      },
      {
        name: "Identities",
        value: "identities",
        pathname: "/people/identities",
        icon: <MenuData />,
      },
      {
        name: "Registrars",
        value: "registrars",
        pathname: "/people/registrars",
        icon: <MenuRegistrars />,
      },
      {
        name: "Verifications",
        value: "verifications",
        pathname: "/people/verifications",
        icon: <MenuIdentity />,
        extraMatchNavMenuActivePathnames: [
          "/people/verifications/auth/discord",
          "/people/verifications/auth/twitter",
          "/people/verifications/auth/github",
        ],
        visible: hasActiveJudgementRequest,
      },
      isAdmin && {
        name: "Judgement Requests",
        value: "judgement-requests",
        pathname: "/people/judgement-requests",
        icon: <MenuJudgements />,
      },
      {
        type: "divider",
      },
      {
        name: "Usernames",
        value: "usernames",
        pathname: "/people/usernames",
        icon: <InfoUsers />,
      },
    ].filter(Boolean),
  };
}
