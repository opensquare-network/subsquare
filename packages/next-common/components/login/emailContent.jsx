import { useState } from "react";
import styled from "styled-components";
import { Option } from "next-common/components/addressSelect";
import VerifyEmail from "next-common/components/login/verifyEmail";
import EmailInput from "next-common/components/login/emailInput";
import ConfirmEmail from "next-common/components/login/confirmEmail";
import useIdentity from "next-common/utils/hooks/useIdentity";
import GhostButton from "../buttons/ghostButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { CACHE_KEY } from "../../utils/constants";
import { useCookieValue } from "../../utils/hooks/useCookieValue";
import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import { GreyPanel } from "../styled/containers/greyPanel";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useRouter } from "next/router";
import { SystemCheckboxOff, SystemCheckboxOn } from "@osn/icons/subsquare";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
  color: var(--textPrimary);
`;

/**
 * @description AKA remind email
 */
export default function LoginEmailContent() {
  const chain = useChain();
  const loginUser = useUser();
  const { connectedWallet } = useConnectedWalletContext();
  const address = loginUser?.address;
  const accountName = connectedWallet?.name;
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [dontRemindEmail, setDontRemindEmail] = useCookieValue(
    CACHE_KEY.dontRemindEmail,
    false,
  );
  const { closeLoginPopup } = useLoginPopup();
  const router = useRouter();
  const isEmailPage = router.pathname === "/email";

  const identity = useIdentity(address, chain);

  function handleSkip() {
    if (isEmailPage) {
      router.replace(router.query?.redirect || "/");
    } else {
      closeLoginPopup();
    }
  }

  return (
    <div className="space-y-6">
      <PageTitleContainer>Login to SubSquare</PageTitleContainer>

      <GreyPanel className="text14Medium px-4 py-2.5 !rounded-lg text-textSecondary">
        Set email for receiving notifications
      </GreyPanel>

      <div className="space-y-2">
        <Label>Web3 address</Label>
        <div className="[&_div]:rounded-lg">
          <Option item={{ address, name: accountName }} selected />
        </div>
      </div>

      <div className="space-y-2">
        <EmailInput
          identity={identity}
          email={email}
          setEmail={setEmail}
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      {email &&
        (email !== identity?.info?.email || !identity?.isAuthorized) && (
          <div>
            <VerifyEmail
              pin={pin}
              setPin={setPin}
              email={email}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        )}

      <div className="space-y-2">
        <ConfirmEmail
          pin={pin}
          email={email}
          identity={identity}
          setErrors={setErrors}
        />
        <GhostButton isFill onClick={handleSkip}>
          Skip
        </GhostButton>
        <span
          className="inline-flex items-center select-none space-x-2 text14Medium text-textSecondary"
          onClick={() => {
            setDontRemindEmail(!dontRemindEmail);
          }}
        >
          {dontRemindEmail ? (
            <SystemCheckboxOn className="w-5 h-5 [&_rect]:fill-theme500" />
          ) : (
            <SystemCheckboxOff className="w-5 h-5" />
          )}
          <span>Don{"'"}t remind me next time</span>
        </span>
      </div>
    </div>
  );
}
