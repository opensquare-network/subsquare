import { useTheme } from "styled-components";

function resolveBannersRepoFilepathUrl(filename) {
  return `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/banner/${filename}`;
}

export default function ProfileBanner() {
  const { isDark } = useTheme();

  const imgSrc = resolveBannersRepoFilepathUrl(
    `imgBannerProfile${isDark ? "Dark" : "Light"}.webp`,
  );

  return (
    <div>
      <img
        src={imgSrc}
        alt="Banner"
        className="w-full h-30 object-cover"
      />
    </div>
  );
}
