import ProjectLogoPolkadotDarkPng from "./logoPolkadotDark.png";
import ProjectLogoPolkadotLightPng from "./logoPolkadotLight.png";

function ProjectLogoPolkadotDark(props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={ProjectLogoPolkadotDarkPng.src}
      alt="Polkadot Logo Dark"
    />
  );
}

function ProjectLogoPolkadotLight(props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={ProjectLogoPolkadotLightPng.src}
      alt="Polkadot Logo Light"
    />
  );
}

export {
  ProjectLogoPolkadotDarkPng,
  ProjectLogoPolkadotLightPng,
  ProjectLogoPolkadotDark,
  ProjectLogoPolkadotLight,
};
