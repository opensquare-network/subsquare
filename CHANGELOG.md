# Changelog

All notable changes to this project will be documented in this file.

# 1.9.8

- Code refactor
  - Encode address code refactor
  - Remove some useless functions
  - Extract common components and services
- kintsugi: fill input value when clicking voting balance
- Fix bounty active color
- Add off-chain voting to menus

## 1.9.7

- Support polkadex
- Code refactor: keep only the redux store on next-common package
- Create chainSlice to store the latest chain height and block time
- Extract common styled components

## 1.9.6

- Improve time duration format
- Style improvement like correct font size in timeline
- Show time for end and delay in referendum metadata
- Extract common components

## 1.9.3

### Added

- Show motion end information for Kintsugi tech.comm motions.
- Add loading effect to Kintsugi referenda vote dialog.

### Update

- Kintsugi Tech.Comm Motions in overview condition: ended in the past 3 days => ended in the past 1 day.

### Fixed

- Prevent code execution after to404 function is called.
- Form validation error hint style fixup.

### Refactor

- Some shared components are migrated to `next-common`.
- Split the component interacting with `PolkadotExtension` into more atomic pieces.

### Removed

- Un-used functions and importation statements.

## 1.9.2

### Added

- Show scrollbar for long address list selection.
- Show council/TC/financial council motion time counting down.
- Update tip state with the tip extrinsic.

### Fixed

- Correct state tag background color.
- Fix Timeline last activity time.

### Refactor

- Remove unused view layer utility functions for kintsugi.

## v1.9.1

### Added

- Handle democracy public proposal canceled status.

### Fixed

- Fix Council/TC motions post time updating.
- On-chain tippers data-fetching incorrect field name fixup.
- Kintsugi referendum metadata ongoing status display fixup.

## v1.9.0

### Added

- Show spinner before referendum voting threshold loaded.
- Display proposeCurator arguments in bounty timeline.
- Show democracy voting process in Kintsugi treasury proposal timeline.
- Loading effect for tippers card.

### Fixed

- Fix referendum info update when the delay is 0.
- Rearrange menus.
- Timeline folding status fixup.
- CSS fixup.
- Typo fixup.

## v1.8.1

### Fixed

- Metadata display fixup

## v1.8.0

### Fixed

- Support Kintsugi fixup
- Shared UI components between next & dedicated kintsugi-next projects

## v1.7.2

### Added

- Support Acala
- Support Kintsugi
- Handle with FastTrack event

## v1.7.1

### Fixed

- GitHub Flavored Markdown support fixup

## v1.7.0

### Added

- Support Bifrost

### Fixed

- Metadata display issues

## v1.6.8

### Added

- Support Kabocha

### Fixed

- Karura onchain Treasury summary display

## v1.6.7

### Fixed

- Motions URL fixup

## v1.6.6

### Added

- Financial Council support for Karura
- Display current Treasury pot above treasury related pages
- Scan function for democracy preimage
- Migrate more functions into scan-common package
- New next-common package for shared UI components

### Fixed

- UI fix up
- Abbreviate big number display
- Show linked business information in motions

### Update

- New private policy
- Regular dependency update

## v1.6.5

### Added

- Create post for Tech.Comm. proposals and support the corresponding discussion
- Design and improve the post preview in SNS
- Improve code block view for text edit with markdown
- Editors height adapts to the contents
- Loading effect for comments submission

### Fixed

- Tech-comm motion display issues
- Improve bounty description layout
- Correct post time(use a block time if available)
- Correct sub-scan external link

## v1.6.4

### Added

- Add website pages metadata to enhance the preview on SNS
- Support markdown table
- Rich text editor now supports inserting embeded Youtube link
- Show the warning of invalid democracy proposal image

### Fixed

- Remove invalid block-chain nodes
- Remove out-dated info form overview page
- Fix posts updated time mis-display
- Fix wrong link addresses in emails
