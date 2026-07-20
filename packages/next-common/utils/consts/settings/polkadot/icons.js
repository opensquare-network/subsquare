import dynamic from "next/dynamic";

const ProjectLogoPolkadotDarkSvg = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoNewPolkadotDark"),
);

const ProjectLogoPolkadotLightSvg = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoNewPolkadotLight"),
);

function ProjectLogoPolkadotDark(props) {
  return <ProjectLogoPolkadotDarkSvg width={40} height={40} {...props} />;
}

function ProjectLogoPolkadotLight(props) {
  return <ProjectLogoPolkadotLightSvg width={40} height={40} {...props} />;
}

export { ProjectLogoPolkadotDark, ProjectLogoPolkadotLight };
