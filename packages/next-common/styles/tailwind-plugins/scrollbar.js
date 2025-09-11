const plugin = require("tailwindcss/plugin");

exports.plugin = plugin(({ addUtilities }) => {
  addUtilities(
    {
      ".scrollbar-pretty": {
        "&::-webkit-scrollbar": {
          width: "4px",
          height: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--neutral500)",
          "border-radius": "4px",
        },
      },
      ".scrollbar-hidden": {
        /* IE and Edge */
        "-ms-overflow-style": "none",

        /* Firefox */
        "scrollbar-width": "none",

        /* Safari and Chrome */
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
      ".scrollbar-default": {
        /* IE and Edge */
        "-ms-overflow-style": "auto",

        /* Firefox */
        "scrollbar-width": "auto",

        /* Safari and Chrome */
        "&::-webkit-scrollbar": {
          display: "block",
        },
      },
    },
    ["responsive"],
  );
});
