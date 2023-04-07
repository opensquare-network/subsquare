# Changelog

All notable changes to this project will be documented in this file.

# 3.0.2
date: 04/06/2023
- Support nest comments.
- Support democracy public proposals batch seconds action.
- Fix treasury bounty approve/reject voting state tag color.
- Improve tally numbers' view on mobile page.

# 3.0.1
date: 03/31/2023
- Support closing collective motion.
- Flatten menu, remove the separation of gov2 from gov1.
- Improve CI build and style prettier.
- Show OpenGov referenda vote extrinsic time with local time.
- Update polkadot/kusama/collectives endpoints.
- Add zeitgeist advisory committee motions to overview page.
- Set default page size on list page to 25.
- Fix style issues.

# 3.0.0
date: 03/27/2023
- Add calendar feature which show history governance events and future events.
- Fix fellowship section header, previously mistaken with referenda.
- Show vote turnout percentage for democracy referenda.
- Refactor to avoid duplicated image assets.
- Improve project config to avoid annoying LSP diagnostics.

# 2.9.9
date: 03/22/2023
- Support binding a discussion post for proposals.
- Add a search box to header, google in site search for this release.
- Improve and normalize various chain header logos.

# 2.9.8
date: 03/13/2023
- Add login user profile link to the dropdown menu.
- Customize zeitgeist advisory committee motion market info.
- Improve popup responsive style.
- Fix delegation items responsive scroll style.
- Improve husky hooks for eslint.

# 2.9.7
date: 03/03/2023
- Enable polkadot collectives.
- Fix cmdk mask background color.
- Improve eslint config and fix lint warnings.
- Add warning bar for scam proposals.

# 2.9.6

date: 02/28/2023

- Add zeitgeist advisory committee motion events subscription UI.
- Support discussion post labels.
- Extract more hooks for collective pallet.

# 2.9.5

date: 02/17/2023

- Add OpenGov2 activities to user profile.
- Support cmdk.
- Support alliance features for collectives para-chain.
- Enable child bounties for khala/phala.
- Refactor
  - Overview page and backend apis code.
  - All backend controllers code structure.
- Fix bugs.
- Update dependencies.

# 2.9.4

date: 02/15/2023

- Add subscription UI for OpenGov.
- Add a link to list page for overview categories.
- Improve post body word break.
- Fix bug: can not create post after canceling polls.
- Fix bug: financial motion state.

# 2.9.3

date: 02/08/2023

- Show split vote for OpenGov.
- Customize zeitgeist advisory committee call on the motion detail page.
- Fix statescan url.
- Fix bugs.

# 2.9.2

date: 02/07/2023

- Show enhanced user delegation/been delegated info for OpenGov referenda.
- Support litentry.
- Fix babel configurations.
- Fix democracy referendum estimated execution time when passed.

# 2.9.1

date: 02/03/2023

- Support zeitgeist advisory committee.

# 2.9.0

date: 02/03/2023

- Support Split/AbstainSplit vote for democracy and OpenGov.
- Add page view for un-finalized proposals, not redirect users to 404 page.
- Add ignore checkbox for email setting reminder in the login process.
- Refactor duplicated popup components.

# 2.8.2

date: 01/28/2023

- Hide democracy launch period for kintsugi/interlay.
- Enable bounties for litmus.

# 2.8.1

date: 01/18/2023

- Show OpenGov referenda on overview page.
- Add timeline for treasury proposal approved by OpenGov.
- Change default IPFS gateway to that of infura.
- Remove discussions elements for centrifuge/altair.
- Support OpenGov inline proposal call.
- Fix confirmation countdown of OpenGov referenda on list page.
- Fixes including layout, styles, typos.

# 2.8.0

date: 12/31/2022

- Add track curve chart for each OpenGov referendum.
- Add cookie consent modal.
- Show treasury proposals by OpenGov referenda.
- Fix styles: overview item href property, extract neutral panel, etc.

# 2.7.0

date: 12/26/2022

- Add active proposals count panel on summary page.
- Support fellowship voting and show all votes.
- Show address/value list who has delegated their vote to login address.
- Support show referenda `SplitAbstain` vote type.
- Code refactor: extract `GreyPanel` component.

# 2.6.3

date: 12/17/2022

- Add curve chart on referenda track page.
- Support threshold visualization of fellowship referendum.

# 2.6.2

date: 12/15/2022

- Bind kintsugi public proposal with treasury proposal.
- Show kintsugi escrow value, and the staked balance.
- Show my vote on democracy and OpenGov referendum detail page.
- Increase the syncing time after submitting extrinsics.
- Show the estimated token lock time for conviction voting.
- Style fixes including markdown content hr element color.

# 2.6.1

date: 12/14/2022

- Change bifrost to bifrost kusama, and fix subscan external link.
- Show active referenda number when menu fold.
- Show related `treasury#spend` business for OpenGov referendum.
- Query on-chain tally for active referendum.

# 2.6.0

date: 12/09/2022

- Support fellowship, including referenda and members.
- Support proxy setting, and all extrinsics will be wrapped in proxy call if a proxy address set.
- Add eslint config to check next-common package errors.
- Remove unnecessary timeline item parameters.
- Fix css issues.

# 2.5.0

date: 11/30/2022

- Improve gov2 referenda tracks menu.
- Use the login address to sign extrinsics, and remove address selection.
- Show gov2 referendum tally approval and support threshold.
- Support democracy pallet delegation and refactor democracy section panel.
- Improve treasury list items value display.

# 2.4.7

- Disable background page scrolling when popup is shown.
- Fix theme toggle with react context, while previously we use redux.
- Fix democracy second api call with the latest version.
- Always show gov2 referendum confirmation bar and improve the background color.
- Fix democracy referendum hash introduced by the latest democracy pallet version.

# 2.4.6

- Support gov 2.0 track delegation.
- Turn on gov 2.0 for kusama.
- Add breadcrumb various proposals.
- Sync polkassembly content for gov 2.0 proposals.
- Improve subsquare/polkassembly default comments tab choice.
- Improve child bounty value display.
- Fix page width for some pages including empty overview page, settings page, etc.

# 2.4.5

- Remove @polkadot/api patch for account nonce.
- Remove disabled status for tip endorse.
- Fix nested delegation votes for gov2.
- Fix styles.

# 2.4.4

- Fix treasury new proposal/tip value with string arg.
- Fix nested delegations votes bug.

# 2.4.3

- Support Rococo.
- Fix referenda menu style in mobile.
- Fix page layout of council/TC members and settings page.
- Hotfix menu external link icon style.
- Fix councilor tip extrinsic.

# 2.4.2

- Support gov 2.0.
- Home menu foldable.
- Support TC motion and democracy subscription and notification.

# 2.4.1

- Upgrade dependency of @polkadot/api to 9.6.2.
- Use rpc to query total supply and escrow balance for kintsugi/interlay.

# 2.4.0

- Support treasury and motion notifications.
- Refactor detail pages.
- Add loading effect to thumb up action.
- Set users link to domestic.
- Refactor components.
- Fix councilor check in tip.
- Fix link/unlink address.
- Style fixes and hotfixes.

# 2.3.2

- New network selection drop down menu.
- Fix motion vote number.
- Fix link identity icon.
- Fix tip beneficiary, and tip/bounty timeline by polkadot/api upgrade.
- Improve polkassembly democracy links.
- Fix child bounty beneficiary checking.
- Fix styles.

# 2.3.1

- Use the login web3 address as the default signer for actions.
- Support claiming child bounty.
- Add unsubscription link in notification emails.
- Remove useless user profile query in `Auth` component.
- Fix toast item style.

# 2.3.0

- Add profile page to show user governance activities.
- Add countdown component for tips, child bounties, and bounties.
- Add tip status to the tip card.
- Improve system#remakr view by checking whether bytes are utf8.

# 2.2.5

- Add referendum to treasury proposal's timeline.
- Show motion vote status.
- Fix address login page SSR.
- Fix typo: referendums -> referenda.
- Fix bounty/child bounty award timeline item.
- Hotfix kintsugi/interlay thumbs up expand crash bug.

# 2.2.4

- Support altair.
- Fix twitter share location in post author view.
- Fix tc and council motions on democracy navigation.

# 2.2.3

- Support login with talisman and subwallet.
- Support share post to twitter.

# 2.2.2

- Refactor pagination component.
- Use scanned electorate for vote finished referendum.
- Add all referenda votes.
- Fix typescript markdown preview.
- Support centrifuge and zeitgeist.
- Support copy comment url.
- Style and typo fix.

# 2.2.1

- Add check all councilors and TC members link.
- Fix motion id.
- Fix motion voter, no proposer as default aye vote.
- Fix styles:
  1. Caret color on dark mode.
  2. Markdown text no-wrap.
  3. Tag color

# 2.2.0

- Support dark mode.
- Sync polkassembly discussion posts and all comments for Kusama/Polkadot.
- Code refactor including new layout, tags, buttons, etc.

# 2.1.4

- Support customize poll end data.
- Improve balance loading on treasury proposal modal.
- Fix council/TC members page layout.
- Show extrinsic failed info on toast.
- Support democracy `ProposalCanceled` scan.

# 2.1.3

- Support phala and turn on crust
- Apply OpenSquare editor and markdown renderer
- Refactor icons and remove redundant icons in next and kintsugi-next package
- Hotfix: vote button not shown for council members on motion detail page
- Handle post empty title
- Fix child bounty title and style on parent bounty detail page
- Fix kintsugi/interlay treasury modal balance

# 2.1.2

- Support discussions post polls
- Upgrade dependency to @polkadot/api
- Refactor part of icons

# 2.1.1

- Support set post banner
- Refactor chain settings which will benefit new chain support
- Support centrifuge. Support track motion `fast_track` external proposal.
- Add loading state when setting verification email on email page
- Fix bugs by missing of React imports
- Set all signatories to be the authors of a proposal

# 2.1.0

- Support new network: polkadot, kusama, crab, polkadex, turing
- Replace updated time icon
- Correct interlay vote symbol
- Fix interlay treasury value
- Show council prime voter
- Style fix: bullets, inline code

#2.0.1

- Support safari >= 14.0
- Fix electorate query
- Show polkassembly lik for polkadot and kusama
- Change kintsugi SNS preview cover
- Fix tip finder

#2.0.0

- Support Kusama
- Implement did login
- Support safari and improve the compatible page
- Improve public proposal second list
- Fix referendum electorate
- Upgrade dependency to @polkadot/api

# 1.10.4

- Support public proposal second action
- Support proposing treasury proposal
- Support crust and calamari
- Fix the link to 404 page from user without linked address
- Improve timing to close popup when extrinsic is wrapped in block
- Extract common components to better scale democracy vote actions

# 1.10.0

- Prevent error by ethereum address in polkadot extension
- Customize the header for chains
- Refactor code to separate backend from main repo

# 1.9.10

- Add council motion to democracy proposal navigation bar.
- Add pending toast when submitting extrinsic transaction.
- Show referenda at the top of overview page.
- Update @polkadot/api dependency to 7.13.1.

# 1.9.9

- Add accordion effect for detail page metadata/timeline
- Normalize bounty metadata(fixed some value normalization)
- Support interlay
- Support polkadex democracy
- Fix markdown editor memory leak(update unmounted component)

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
