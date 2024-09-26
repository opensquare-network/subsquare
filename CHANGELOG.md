# Changelog

All notable changes to this project will be documented in this file.

### 4.2.9

date: 2024-09-25

- Add a filter for OpenGov referenda to see all un-voted referenda.
- Upgrade dependency to @polkadot/api.
- Fix modules control by chains to fix chain deprecated modules like democracy and council.
- Support teleport token from polkadot to assethub.
- Support native token transfer for polkadot, kusama, westend and rococo.
- Refactor assethub assets management with context.
- Remove new tag from referenda tracks tab.

### 4.2.8

date: 2024-09-23

- [Big] Support fellowship sub treasury.
    - Scan treasury related events/extrinsics and serve related data via API.
    - Add fellowship treasury list and detail page.
    - Add a treasury spend template on fellowship new referenda popup.
- [Medium] Support creating proposal for collectives like council, astar community council, etc.
- [Medium] Support multi assets treasury for polkadot.
- Refactor chain settings for modules control.
- Fix menu active count.
- Add filters on fellowship members page.
- Improve Astar community council treasury approval template with a treasury proposal select component.
- Fix editor style issues by correcting dependency to styled components.
- Fix transferable on assethub teleport popup.
- Improve treasury spend paid state color.
- Upgrade dependency to vite and next.js.
- Enhance view for very small value.
- Improve the way to check loading for collective(council) members.
- Fix styles and refactor code.

### 4.2.7

date: 2024-09-11

- [Medium] Add a context on top of collective pallet instances related pages including council, tech committee, etc. So
  we can increase code reusability and reduce bugs.
- [Medium] Design and improve the referenda decision progress bar for cases when deciding time is over the normal time(
  defined by track).
- Use subscription to update collective votes, so we don't have to trigger the update after vote.
- Add claim button on bounty detail page.
- Extract assets info by XCM v4 on treasury related spends pages.
- Improve account info layout on polkadot assethub.
- Refactor:
    - Support block hash as param for hook `useBlockApi`.
    - Support custom api for hook `useSubStorage`.
    - Improve some contexts with createStateContext.
    - Improve the way to get fellowship max voters.
    - Improve `web3Enable` origin for extensions.
    - Use subscription to get tip meta.
    - Remove useless redux items.

### 4.2.6

date: 2024-09-06

- [Medium] Improve eslint rule and fix react hook dependencies.
- Refactor treasury related pages with context and fix astar community treasury overview data.
- Show referenda confirmation attempts time duration.
- Fix extrinsic submission with talisman.
- Remove litmus and turing network from network menu.
- Fix styles [#4650](https://github.com/opensquare-network/subsquare/issues/4650).

### 4.2.5

date: 2024-09-04

- Fix Markdown table color.
- Fix call tree view for inline call.
- Astar community treasury
    - Fix to be awarded value
    - Fix proposal un-finalization check.
    - Add award countdown on proposal detail page.
- Enable statescan for collectives.
- Fix transferable when balance is 0.

### 4.2.4

date: 2024-09-03

- [Big] Refactor the code to submit transactions.
- Enhance `valid_from` UI on referenda submission modal.
- Polkadot fellowship
    - Improve some text about fellowship, like expenditure -> salary, etc.
    - Improve demotion warning text on fellowship core page.
    - Remove westend collectives because nobody use it.
    - [Medium] Refactor code to increase code reusability. We created hooks to replace redux slices.
    - Fix referendum redirection after creation.
    - [Medium] Support fellowship evidence by either IPFS or bytes content.
    - Fix fellowship promote/bump button status.
    - Add advanced options on new approval/promotion related popups to hide referendum details.
- Update endpoints.
- Add assets transfer history on subsquare polkadot assethub.
- Support hydration EVM transaction with multiple gas assets.
- Fix referendum decision deposit check.
- Display curator info on bounty detail page.
- Support Astar and its testnet Shibuya network.
- Support zkverify testnet.
- [Bug] Fix transferable balance calculation.
- [Medium] Enhance treasury spends info on referendum detail page
  like [#944](https://polkadot.subsquare.io/referenda/944).
- Fix expiration countdown component on treasury spend detail page.
- [Bug] Fix tabs not highlighted on profile page due to incorrect hooks dependencies.
- Code refactor and dependencies upgrade.

### 4.2.3

date: 2024-08-20

- Polkadot fellowship
    - [Big] Add polkadot fellowship statistics page.
    - [Medium] Add more filters on fellowship core page.
    - Add salary related warnings on overview page to inform members to register and claim salary.
    - Show demotion/promotion progress bar on fellowship members page.
- Subscribe treasury spend status on detail page and update post when new update detected.
- Enable kill/cancel referenda templates for westend.
- AssetHub
    - Support assethub cross chain with relay chain.
    - Support litentry/litmus decimals change.
    - Fix assethub profile page crash.
    - Show proxy and extension metadata update warnings on assethub overview page.
- Support astar test network shibuya.
- Fix broken post rendered table by markdown [#4580](https://github.com/opensquare-network/subsquare/issues/4580).
- Fix open graph social media link.
- Fix styles and refactor code.

### 4.2.2

date: 2024-08-06

- [Big] Implement SIMA governance spec for OpenGov referenda and treasury proposal.
- [Big] Add referenda tracks visualization page.
- [Medium] Add referenda templates to cancel/kill a referendum.
- Collectives
    - Show fellowship/ambassador member basic info on profile page.
    - Show fellowship/ambassador member core(management) feeds on profile page.
    - Show fellowship/ambassador member salary payments and feeds on profile page.
    - Handle collective member case when demotion period is 0.
    - Improve demotion/promotion progress bar display with different colors.
- Add user warnings for assethub assets management.
- Refactor and improve styles.

### 4.2.1

date: 2024-07-30

- Fellowship
    - Add core members management warnings.
        1. Show how many members' evidences need to be handled.
        2. Show members' demotion warnings.
        3. Show members' promotion warnings.
    - Add referenda templates including members promotion and retain.
    - Add a panel on fellowship core params to give more explanations.
    - Set default page size to 25 on salary cycle detail page.
- Add a notification on account panel to enable connected user to update chain runtime metadata to extension.
- Use subscribed referendum info by default on referendum detail page.
- Support referenda for altair chain.
- Not shown treasury spend valid from count down when no chain height got.
- Refactor and fix styles.

### 4.2.0

date: 2024-07-25

- [Big]Support assethub, now features implemented includes assets transfer and all assets metadata list.
- [Big]Refactor address connect related components.
- Add templates on preimages page.
- Fix markdown previewer for code block view and styles.
- Prevent multiple extensions popup when login.
- Remove new tag from referenda whales and statistics tab.
- Set nav menu collapsed as default.
- Increase cookie expire time.
- Refactor: take place of useClickOutside with useClickAway.
- Add remark template to fellowship new referenda popup.
- Improve the style of new referenda templates.
- Cache metadata for assethub chain to improve the performance of querying stable coin treasury.
- Fix page height by sidebar height on proposal detail page.
- [Big]Show on-chain evidence for polkadot collectives including fellowship and ambassador.
- Check permissions for collective(fellowship/ambassador) vote and refactor the vote popup.
- Make the fellowship induction address input component more obvious.
- Show un-voted fellowship referenda for members.
- Refine account panel for collectives to show fellowship and ambassador status.
- Show related referenda on fellowship core member card.
- Upgrade the dependence to polkadot api.
- Extract useSubStorage to simplify storage subscription.
- Other code refactor and fix styles.

### 4.1.1

date: 2024-07-11

- Support PolkaGate Metamask snap.
- Add valid and expiration count down for treasury spends.
- Support payout action for treasury spends.
- Fix user avatar on comments from polkassembly.
- Set conviction votes decimal to 1.
- Improve editor loading effect.
- Fix code block style on post detail.
- Add fellowship/ambassador rank tag on profile page.
- Auto login when link/unlink a post to a proposal.
- Fix user identity on address input.
- Add withSignedTransaction to signer options.
- Fix tabs components key.
- Fix styles and upgrade dependencies.

### 4.1.0

date: 2024-07-04

- [Big] Support ambassador related business on collectives.
- [Big] To improve the next.js hydration time, lazy load various components/pages including quill.js editor, referenda
  whales page, statistics page, etc.
- Fix polkadot fellowship demotion period business when it's 0.
- Introduce `react-use` to simplify hooks.
- Enable referenda for Basilisk.
- Update kusama decentralized voices cohort 2 delegates.
- Take place of moment.js with day.js.
- Subscribe referenda info decision deposit so UI will update immediately when deposit placed.
- Code refactor.
- Upgrade dependencies including cmdk, wagmi, polkadot.js, etc.

### 4.0.7

date: 2024-06-14

- [Big] Support treasury spends.
- Lazy loading many popup components.
- Add a foldable referenda menu for fellowship.
- Show comments immediately after loading from server.
- Add Father's Day sidebar decoration.
- Fix connect address error.
- Fix detail page chart config.

### 4.0.6

date: 2024-06-13

- [Big] Support more EVM wallets with [wagmi](https://wagmi.sh/).
- [Medium] Support comments filter.
- Update endpoints.
- Hide avatar prompt if connected user already set.
- Support westend testnet.
- Show core and salary sections for westend collectives.
- Update decentralized voice cohort 2 delegates for polkadot.
- Show requested stable coin value in overview request column.
- Upgrade dependencies.

### 4.0.5

date: 2024-06-07

- Add USDx treasury spend proposal template for OpenGov referenda.
- Add `system#remark` proposal template for OpenGov referenda.
- Fix fellowship core approve referendum template track.
- Support avatar setting by SIMA spec.
- Support hydraDX rebranding to hydration.
- Add dragon boat header decoration which will show near dragon boat festival.
- Fix delegate search for chains which support both substrate and EVM.
- Fix styles.

### 4.0.4

date: 2024-05-30

- Support SIMA spec avatar setting/unset.
- Fix polkassembly comments for collectives.
- Show USDx treasury spend info on post list and detail page.

### 4.0.3

date: 2024-05-20

- Support treasury proposal template for referenda.
- Support evidence submission for polkadot fellowship members.
- Upgrade dependency to next.js 14.1.1.
- Extract call args from `coreFellowshp#approve` call.
- Add loading effect for editor.
- Remove identity timeline for kusama, because identity is moved to people chain.
- Refactor summary component.
- Fix styles.

### 4.0.2

date: 2024-05-08

- Add a button for fellowship member to create a referendum to approve a member.
- Support fellowship member to claim salary.
- Support fellowship salary bump.
- Fix symbol color on tooltip.
- Update dependency to @polkadot/api.
- Update bifrost settings.
- Fix collectives alliance unscrupulous page crash.
- Code refactor.

### 4.0.1

date: 2024-04-30

- [Big] Support user creating new fellowship referenda proposal.
- [Big] Add an escrow statistics page for interlay/kintsugi.
- Add an induction panel on fellowship home page.
- Support shortcut actions for fellowship members to create a member promotion referendum.
- Support fellowship members to import himself/herself to salary system.
- Support fellowship members to register a salary cycle.
- Fix fellowship salary cycle expenditure.
- Fix induction status and registered number on fellowship salary summary.
- Add query param on referenda detail page to locate tabs.
- Improve RPC nodes connection by not setting the first one as default.
- Add labor day decorations.
- Add an icon on list page to show malicious posts or proposals.
- Refactor and fix, improve styles.

### 4.0.0

date: 2024-04-19

- [Big] Show OpenGov voting whales.
- [Big] Show referendum statistics on detail page.
- [Big] Implement centrifuge dashboard on overview page.
- [Medium] Show decentralized voices status and DV tags on detail page.
- [Medium] Support self induction to polkadot fellowship salary system for fellowship members.
- [Medium] Refactor connect wallet popup and support signet multisig wallet.
- Show self and total votes on profile votes page.
- Add filter to polkadot fellowship core/salary feeds.
- Improve polkadot fellowship salary claimants fetch source, so we can update it in time.
- Add a tooltip component on overview page to warn user they are performing as a proxy.
- Show preimage missing warning for democracy referenda.
- Refactor module fields in chain settings.
- Fix styles and code refactor.

### 3.9.1

date: 2024-04-06

- Add fellowship salary claimants page.
- Add members summary for fellowship salary module.
- Show my delegate card in a separate section.
- Add preparing referenda number on referenda list summary.
- Set OpenGov as the default tab of posted tab on profile page.
- Remove useless tabs on referenda my votes page.
- Fix styles and update dependencies.

### 3.9.0

date: 2024-03-22

- [Big] Add delegation UI. Show delegates with their announcements.
- [Big] Implement polkadot fellowship salary cycle detail page.
- Support Centrifuge EVM.
- Add transfers and identity tab on profile page for polkadot/kusama.
- Fix EVM address profile url.
- Disable batch removing votes when votes >= 10 for HydraDX.
- Refactor council members page and improve the way to query data.
- Add `ApiContext` to host api instance.
- Pass params via context for various popups.
- Remove outdated props for multiple select components.
- Only council members can call `TipNew`.
- Enable dotreasury for Centrifuge.
- Fix styles and code refactor.

### 3.8.8

date: 2024-03-04

- Add fellowship salary cycles page.
- Show delegation status on profile page.
- Correct referenda delegators on statistics page.
- Query polkassembly comments from backend API.
- Upgrade dependencies and fix styles.

### 3.8.7

date: 2024-02-27

- [Medium] Support EVM account for hydraDX.
- Bump rich text editor.
- Fix call tree view none value.
- Fix styles.

### 3.8.6

date: 2024-02-08

- Change scan height subscription to loop query.
- Add lunar new year decoration on menu.
- Refactor and improve styles.

### 3.8.5

date: 2024-02-04

- [Big] Support fellowship core system business.
    - Core members page.
    - Core feeds page.
    - More params page to core system.
    - Support induct, import and bump actions.
- Introduce and develop new set of button components.
- Integrate Mimir multisig wallet.
- Add conviction voting lock explanation.
- Enable referenda for darwinia2.
- Fix preimage deposits layout.
- Query polkassembly comments from fronted.
- Make RPC endpoints configurable.
- Extract a transaction submission button and refactor some code for submitting txs.
- Fix active referenda/fellowship count in menu.
- Improve styles.

### 3.8.4

date: 2024-01-31

- Change detail page subscription to loop query.
- Add fellowship core members page.
- Fix tailwind fond plugin.
- Fix styles.

### 3.8.3

date: 2024-01-24

- Support creating democracy public proposal.
- Disable editor posting when uploading images.
- Show discourse forum topics for acala/centrifuge.
- Fix bifrost polkadot treasury fiat value.
- Show polkadot collective RFCs on overview page.
- Reduce fetched data size for list pages.
- Fix post content font smoonthing.
- Code refactor and fix styles.

### 3.8.2

date: 2024-01-19

- [Medium] Support creating OpenGov referenda proposal.
- Add salary status panel for polkadot collectives.
- Show forum topics for polkadot/kusama/rococo.
- Remove subscription for finished proposal detail page.
- Render fellowship members with server side data.
- Adjust RPCs for collectives chain.
- Improve collectives params table value.
- Sync polkassembly proposal data for zeitgeist.
- Sanitize post html and improve styles.
- Fix styles and update @osn/previewer.

### 3.8.1

date: 2024-01-17

- [Medium] Show deposits and multisigs on user profile page.
- Implement params page for polkadot collectives.
- Archive tips menu for polkadot/kusama.
- Redirect user to detail page when a new tip is created.
- Adopt github markdown style and bump osn/previewer.
- Improve loading effect on council vote popup.
- Add treasury state on home page.
- Store metadata with IndexedDb.
- Remove useless state syncing code after child bounty claimed.
- Fix motion/tip columns.
- Fix styles.

### 3.8.0

date: 2024-01-06

- [Big] Implement web3 address connect and remove login.
- [Medium] Refactor list/table component form better render user experience.
- Support preimage pallet `requestStatusFor` storage.
- Refactor democracy referendum status data with subscription.
- Fix next.js SSR warning and bump @osn/previwer.
- Remove useless callbacks when submitting extrinsics.
- Remove ‰ and keep only % for percentage view.
- Update democracy votes more times when tally changed.
- Fix: auto clean error when email verify button clicked.
- Fix and improve styles.

### 3.7.4

date: 2023-12-29

- Improve RPC connections by caching metadata.
- Improve theme color for basilisk, khala and phala.
- Redirect legacy subscription page to notifications page.

### 3.7.3

date: 2023-12-27

- [Big]Support creating new preimage on preimages page.
- Improve RPC endpoints selection and fault toleration.
- Merge polkassembly and subsquare discussions to a single page.
- Create a merry Christmas logo background.
- Show multisig status on my account multisig page.
- Fix styles.

### 3.7.2

date: 2023-12-22

- Support removed tag for democracy to handle democracy pallet removal from polkadot and rococo.
- Fix UI issues with council member list.
- Fix value display symbol color.
- Update @osn/previewer.

### 3.7.1

date: 2023-12-05

- Show my identity deposits.
- Support refunding referenda submission deposit.
- Not show empty proposal sections on overview page.
- Correct dotreasury links.
- Archive gov1 sections for polkadot/rococo.
- Fix article content styles.
- Update dependencies.

### 3.7.0

date: 2023-12-01

- [Big]Show my multisigs on account page.
- [Big]Show my deposits on account page, and a user can refund referenda deposits.
- Introduce AI summary for posts.
- Show vote info besides commenter on OpenGov and democracy referendum detail page.
- Improve preimages page layout on mobile screen.
- Fix and improve styles.

### 3.6.5

date: 2023-11-20

- [Medium] Refactor the layout of overview page.
- Show bounty balance on bounty detail page.
- Enable OpenGov for Bifrost Polkadot and Rococo.
- Update dependencies.
- Fix my referenda votes unlock-able balance calculation.

### 3.6.4

date: 2023-11-03

- Show active proposal numbers on menu for democracy, treasury and various collectives.
- Implement new style of cookie consent popup.
- Take place old map with an LRU cache.
- Add subscription tip component on referenda list panel.
- Fix empty box icon.

### 3.6.3

date: 2023-10-27

- Show estimated confirmation start time on OpenGov referendum page.
- Show a feedback popup after users vote a referendum.
- Fix removing vote call fro moonriver.

### 3.6.2

date: 2023-10-26

- Enable removing my delegations on referenda delegation popup.
- Add query params for profile votes, so we can locate different vote type when page render.
- Refactor the vote popup view for address who have delegated their votes.
- Improve accordion component on notifications page.
- Show toast when notifications are saved.
- Enable vote calls for bifrost polkadot.
- Upgrade dependency of next.js from 13.3.0 to 13.5.0.
- Fix styles.

### 3.6.1

date: 2023-10-19

- [Medium]Support notifications by telegram.
- Add spam folder check warning message on email binding components.
- Improve delegation info number format on referendum detail page.
- Enhance toast style, and make it more striking.
- Add off-chain voting links on my votes page.
- Upgrade dependencies.
- Implement accordion card component.
- Shorten referendum breadcrumb.

### 3.6.0

date: 2023-10-12

- Allow post authors and admins to delete a discussion post.
- Merge comments from subsquare and polkassembly.
- Show my delegated OpenGov referenda votes on my votes management.
- Add a link to all my votes history on my votes management.
- Show OpenGov prior locks on my votes management page.
- Implement enhanced tree view for call on OpenGov and democracy referendum detail page.
- [Medium]Refactor tailwind related codes.
- Fix: kintsugi timeline compact mode doesn't work.
- Add index for posts on discussions page.
- Add loading effect for treasury panel items.
- Fix styles.

### 3.5.2

date: 2023-10-08

- Fix referenda delegation voting checking.
- Clear already stored votes data after leaving referendum detail page.
- Refactor the complex user component.
- Improve tailwind config for vscode.
- Show prior lock for democracy.
- Show empty placeholder for on-chain votes on mobile view.
- Improve `referenda` to `Democracy referenda`.
- Housekeeping: remove useless code.

### 3.5.1

date: 2023-09-30

- Improve content placer when proposal post has no context or no comments.
- Improve loading effect for democracy vote popup.
- Refactor code about my votes management.
- Use scan height before latest chain height query.

### 3.5.0

date: 2023-09-27

- [Medium]Users don't have to login before signing an extrinsic.
- [Medium]Show an address' delegated on chain votes for democracy pallet, while business for OpenGov referenda is still
  under developing.
- Add a hint for users who have set a proxy that we're showing the on chain votes of the proxied account.
- Correct user component for polkassembly users, and users can go to polkassembly user detail page.
- Fix breadcrumb style to prevent case that a breadcrumb item text is too long.
- Fix OpenGov referenda confirmation progress bar if last confirmation abort doesn't cause a rejection.

### 3.4.8

date: 2023-09-23

- Show user balance on profile page.
- Refactor curve components on referendum detail page and fix a bug the curve history chart may not appear.
- Improve scan height subscription and remove redundant ones.
- Add header and menu to terms and privacy page.
- Add councilor link to dotreasury on profile page if an address is previously a councilor.
- Show a hint on my votes component to explain we show proxied account votes when one is set.
- Show multiple beneficiaries when there are multiple ones on referendum detail page.
- Not fetch user identity from `getServerSideProps` which may cause performance problems.
- Fix comments don't update correctly after update.
- Fix dark mode style issues.
- Show timeout countdown for fellowship referenda.

### 3.4.7

date: 2023-09-18

- Refactor various page components and fix post detail data subscription.
- Refactor: pass `focusEditor` function through context and this will make code more clean.
- Fix detail page bug due to removal of kintsugi/interlay treasury pallet.
- Fix child bounty state tag color on detail page.
- Change the contact email to yongfeng@opensquare.network.

### 3.4.6

date: 2023-09-13

- Refactor detail page breadcrumbs.
- Remove `withLoginUserRedux` wrapper function for page components.
- Refactor the code to get list data of server side props.
- Deprecate the legacy login page.
- Fix: login/signup page bugs with web2 users which have email bind with web3 user.
- Fix: update login user information after verification.
- Fix usePreimage deps error.
- Fix acala/karura financial motion state.
- Fix polkassembly discussion post thumbs up reaction view.

### 3.4.5

date: 2023-09-05

- Show my vote and support removing vote on referendum detail page.
- Improve tally history line style of referendum curve chart, and improve chart initialization.
- Implement conviction slider for democracy/referenda pallets.
- Fix styles.

### 3.4.4

date: 2023-09-01

- Render `system#remark` call content with markdown previewer.
- Refactor: Control detail page tabs with data in redux.
- Styles enhancement
    - Improve comment source tab position on detail pages.
    - Fix username alignment with avatar.
    - Fix title alignment with proposal index on list pages.
    - Fix off-chain voting fonts.
    - Fix subsquare icon in dark mode.
    - Improve confirmation progress bar on referendum detail page.
    - Enlarge referenda curves chart size for better view.
- Fix referenda curves data when hovering.
- Fix referendum confirmation bar tooltip.
- Refactor external link component and add subscan link for referenda.

### 3.4.3

date: 2023-08-28

- Add circle packing view for referenda/democracy votes distribution.
- Implement tally history line on the referendum detail tally curve chart.
- Support voters search by address/identity on referenda/democracy votes popup.
- Set default color theme to light.
- Enable post showing less/more feature only when content length is greater than 1200px.
- Update endpoints for various chains.
- Refactor more pages router to follow RESTful rules.
- Fix the interaction conflict between metamask and talisman.
- Fix bugs and styles.

### 3.4.2

date: 2023-08-23

- Refactor routes for referenda/democracy/treasury related pages.
- Show confirmation attempts for OpenGov referenda.
- Fix referenda confirmation bars.
- Add identity support for special addresses, #3165.
- Remove new treasury proposal button for kintsugi/interlay.
- Add notification subscription component on overview panel for kintsugi/interlay.
- Fix editor related styles.

### 3.4.1

date: 2023-08-17

- Add OpenSquare off-chain voting and bounties link to summary page.
- Show OpenGov fellowship votes history on user profile page.
- Add my votes tab to referenda and democracy page.
- Refactor: replace old chain icons.
- Fix styles.

### 3.4.0

date: 2023-08-14

- [Big]Support on-chain votes management, including support for referenda and democracy.
- Fix countdown component default color.
- Add on-chain events subscription warning tip on overview panel.
- Fix styles.

### 3.3.5

date: 2023-08-12

- Feature: support upload images by OpenSquare editor.
- Feature: support scam reporting for various posts.
- Fix locking period color on dark mode.
- Polish: remove democracy and collectives statistics from summary panel.
- Polish: show referendum timeout countdown on referenda list when referenda preparation phase passed but no decision
  deposit put.
- Polish: show multiple remarks if referenda call has multiple `system#remark` or `system#remarkWithEvent` calls.
- Refactor: reuse login popup.
- Fix the mis-behavior when click outside popup.
- Change users link to profile votes page on votes popup.
- Fix reddit icon.

### 3.3.4

date: 2023-08-02

- Feature: add preimages page.
- Feature: add show more/less for long post.
- Fix: twitter summary card preview for various chains.
- Refactor: remove useless code and icons on public directory.
- Refactor: rename v2 files.
- Subscribe interlay/kintsugi locked balance instead of multiple times query.
- Fix invalid icons.
- Chore: disable tailwind built in colors.
- Improve lots of styles, including search box, borders, header, shadow, etc.

### 3.3.3

date: 2023-08-01

- Support login popup and refactor various login related pages.
- Fix kintsugi/interlay treasury balance.
- Refactor kintsugi/interlay democracy next launch related code.
- Add warning components when OpenGov referendum preimage is missing.
- Fix timeline count for OpenGov referendum, treasury proposal and bounty.
- Support OpenGov referendum decision deposit refund.
- Fix project logo dark mode color on navigation panel.

### 3.3.2

date: 2023-07-27

- Add OpenGov referendum confirmation toggle component, so we can see confirmation status in different views.
- Correct referendum decision end calculation.
- Fix tally support bar background color.
- Fix create post page CSS.
- Clean useless code.

### 3.3.1

date: 2023-07-26

- Support [vara network](https://vara-network.io/).
- Fix theme colors.
- Hide votes tab for collectives chain.
- Add account social links from identity on profile page.
- Only show referenda confirmation bar toggle when confirming.
- Fix delegation bar on referendum detail page.

### 3.3.0

date: 2023-07-23

- [Big]New design development, including:
    - Sidebar menu.
    - List, detail, statistics, profile page refactor.
    - Icons, theme color redesign.
    - Other layout refactor.
- [Medium] Support data subscription on proposal detail page, so we don't have to use callback when actions submitted.
- [Medium] Add referenda/democracy votes history on user profile page.
- Add voting countdown component for democracy referendum.
- Enable fellowship for westend collectives.
- Support login with Nova wallet.
- Improve proposal call business extraction.
- Fix democracy referendum vote finished height check.
- Support timeline item link to block.
- Fix markdown `ol` element view.

### 3.2.5

date: 2023-07-04

- Support moonriver.
    - Login with metamask.
    - Various pre-complied contracts interactions.
    - Various collectives support.
- Add treasury award countdown component on proposal detail page.
- Enable democracy vote calls for karura.
- Show related business fields by the info generated by scan process.
- Add api to get history votes of account.

### 3.2.4

date: 2023-06-27

- Implement Referenda delegation for multiple tracks at one time.
- Support [PolkaGate](https://polkagate.xyz/) extension.
- Subscribe referenda/fellowship referendum on-chain info so we can remove the callback function which will update it
  after voting.
- Show fellowship votes count on tally panel.
- Show referenda aye/nay votes from SplitAbstain vote.
- Introduce lodash.capitalize to take place the legacy util function.

### 3.2.3

date:2023-06-22

- Enable events subscription for polkadot collectives deployment.
- Enable OpenGov for Bifrost.
- Reduce unnecessary referendum votes query.
- Improve OpenGov list page title.

### 3.2.2

date: 2023-06-12

- Show fellowship UI on polkadot collectives para chain.
- Implement a status filter for OpenGov referenda.
- Add dotreasury link to subsquare treasury panel for kusama and polkadot.
- Show direct vs delegation vote ratios on OpenGov referendum detail page.
- Fix OpenGov referendum decision deposit button disable status.
- Update votes automatically when OpenGov/democracy referendum tally changed.
- Supported bifrost polkadot para chain.
- Separate democracy/referenda votes scan with the main scan process, add a new api to serve new votes data, and adapt
  this in fronted.

## 3.2.1

date: 2023-06-08

- Refactor child bounty claim related components, and make child bounty claim button enabled only when it's mature.
- Improve fellowship and referenda navigation components to better show their correlation.
- Use subscription way to fetch referenda referendum tally instead of one time query and refactor related components.
- Add referenda filter components so user can filter referenda by their status.
- Show curve chart on fellowship referendum detail page.

## 3.2.0

date: 06/02/2023

- Refactor my delegation/been delegated popup UI, and align with that of delegation statistics.
- Clicking motion close button trigger login modal if no account has login in.
- Allow anyone to claim a child bounty when it's mature.
- Add `maxWidth` attribute for user component, so we can control the space taken by long identity name.
- Add fellowship and referenda navigation UI to show their correlation with call whitelist.
- Optimize nested vote UI, so we can leave more space for delegated votes.
- Subscribe info of democracy referendum and refactor related pages/components, so tally will be updated automatically.
- Integrate [achainable](https://www.achainable.com/) labels to polkadot subsquare.
- Fix styles and bugs.

## 3.1.4

date: 05/30/2023

- Refactor detail container components.
- Improve and fix tooltip components, previously some tooltips were hidden by other containers.
- Add [achainable](https://www.achainable.com/) labels support for kusama.
- Fix mismatch between `useThemeMode` and `useThemeSetting`.
- Show tally bar on OpenGov and democracy referenda.

## 3.1.3

date: 05/26/2023

- Add nested votes view for democracy and OpenGov referenda.
- Extract dedicated detail container components for treasury proposal, tip and OpenGov referendum.
- Fix pages crash due to kusama drops democracy and tips pallet from metadata.

## 3.1.2

date: 05/22/2023

- Populate OpenGov referendum title by parity tip bot automatically.
- Show voting countdown component for democracy referendum.
- Refactor democracy referendum tally with hooks.

## 3.1.1

date: 05/23/2023

- Support kintsugi democracy referenda statistics.
- Update democracy statistics breadcrumb text.
- Fix incorrect metamask interaction.

## 3.1.0

date: 05/22/2023

- Support OpenGov referenda tracks comparison statistics.
- Support OpenGov statistics for each track.
- Add democracy statistics for votes trend.
- Correct council close button disable state.
- Support evm compatible chains, like darwinia2.

## 3.0.5

date: 05/05/2023

- Show min enact period on OpenGov track panel.
- Show OpenGov enactment status on referendum detail page.
- Fix proposal hash is not shown on democracy referendum metadata.
- Fix OpenGov referendum decision deposit popup can not be opened.

## 3.0.4

date: 04/29/2023

- Show delegation statistics for democracy.
- Add components for OpenGov referendum preparing phase visualization.
- Support users to place OpenGov referendum decision deposit.
- Add sharp to dependencies to improve next build image optimization.
- Add statescan link for polkadot/kusama.
- Add link of all tippers on tip detail page.
- Remove unused patch-package dependency and upgrade other dependencies.
- Follow system's appearance setting when a user has no theme setting.
- Support end date setting to calendar user event.

## 3.0.3

date: 04/17/2023

- Upgrade to next.js v13, check [#2809](https://github.com/opensquare-network/subsquare/pull/2809).
- Fix react hydration error, found after next.js v13 upgrade.
- Fix cmd+k shortcut, currently we can use it on every page.
- Add vote type annotation, so we can know the meaning of `/d`, `/s`, `/sa` of vote records.
- Enhance number input component. Now it supports max/min value.

## 3.0.2

date: 04/06/2023

- Support nest comments.
- Support democracy public proposals batch seconds action.
- Fix treasury bounty approve/reject voting state tag color.
- Improve tally numbers' view on mobile page.

## 3.0.1

date: 03/31/2023

- Support closing collective motion.
- Flatten menu, remove the separation of gov2 from gov1.
- Improve CI build and style prettier.
- Show OpenGov referenda vote extrinsic time with local time.
- Update polkadot/kusama/collectives endpoints.
- Add zeitgeist advisory committee motions to overview page.
- Set default page size on list page to 25.
- Fix style issues.

## 3.0.0

date: 03/27/2023

- Add calendar feature which show history governance events and future events.
- Fix fellowship section header, previously mistaken with referenda.
- Show vote turnout percentage for democracy referenda.
- Refactor to avoid duplicated image assets.
- Improve project config to avoid annoying LSP diagnostics.

## 2.9.9

date: 03/22/2023

- Support binding a discussion post for proposals.
- Add a search box to header, google in site search for this release.
- Improve and normalize various chain header logos.

## 2.9.8

date: 03/13/2023

- Add login user profile link to the dropdown menu.
- Customize zeitgeist advisory committee motion market info.
- Improve popup responsive style.
- Fix delegation items responsive scroll style.
- Improve husky hooks for eslint.

## 2.9.7

date: 03/03/2023

- Enable polkadot collectives.
- Fix cmdk mask background color.
- Improve eslint config and fix lint warnings.
- Add warning bar for scam proposals.

## 2.9.6

date: 02/28/2023

- Add zeitgeist advisory committee motion events subscription UI.
- Support discussion post labels.
- Extract more hooks for collective pallet.

## 2.9.5

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

## 2.9.4

date: 02/15/2023

- Add subscription UI for OpenGov.
- Add a link to list page for overview categories.
- Improve post body word break.
- Fix bug: can not create post after canceling polls.
- Fix bug: financial motion state.

## 2.9.3

date: 02/08/2023

- Show split vote for OpenGov.
- Customize zeitgeist advisory committee call on the motion detail page.
- Fix statescan url.
- Fix bugs.

## 2.9.2

date: 02/07/2023

- Show enhanced user delegation/been delegated info for OpenGov referenda.
- Support litentry.
- Fix babel configurations.
- Fix democracy referendum estimated execution time when passed.

## 2.9.1

date: 02/03/2023

- Support zeitgeist advisory committee.

## 2.9.0

date: 02/03/2023

- Support Split/AbstainSplit vote for democracy and OpenGov.
- Add page view for un-finalized proposals, not redirect users to 404 page.
- Add ignore checkbox for email setting reminder in the login process.
- Refactor duplicated popup components.

## 2.8.2

date: 01/28/2023

- Hide democracy launch period for kintsugi/interlay.
- Enable bounties for litmus.

## 2.8.1

date: 01/18/2023

- Show OpenGov referenda on overview page.
- Add timeline for treasury proposal approved by OpenGov.
- Change default IPFS gateway to that of infura.
- Remove discussions elements for centrifuge/altair.
- Support OpenGov inline proposal call.
- Fix confirmation countdown of OpenGov referenda on list page.
- Fixes including layout, styles, typos.

## 2.8.0

date: 12/31/2022

- Add track curve chart for each OpenGov referendum.
- Add cookie consent modal.
- Show treasury proposals by OpenGov referenda.
- Fix styles: overview item href property, extract neutral panel, etc.

## 2.7.0

date: 12/26/2022

- Add active proposals count panel on summary page.
- Support fellowship voting and show all votes.
- Show address/value list who has delegated their vote to login address.
- Support show referenda `SplitAbstain` vote type.
- Code refactor: extract `GreyPanel` component.

## 2.6.3

date: 12/17/2022

- Add curve chart on referenda track page.
- Support threshold visualization of fellowship referendum.

## 2.6.2

date: 12/15/2022

- Bind kintsugi public proposal with treasury proposal.
- Show kintsugi escrow value, and the staked balance.
- Show my vote on democracy and OpenGov referendum detail page.
- Increase the syncing time after submitting extrinsics.
- Show the estimated token lock time for conviction voting.
- Style fixes including markdown content hr element color.

## 2.6.1

date: 12/14/2022

- Change bifrost to bifrost kusama, and fix subscan external link.
- Show active referenda number when menu fold.
- Show related `treasury#spend` business for OpenGov referendum.
- Query on-chain tally for active referendum.

## 2.6.0

date: 12/09/2022

- Support fellowship, including referenda and members.
- Support proxy setting, and all extrinsics will be wrapped in proxy call if a proxy address set.
- Add eslint config to check next-common package errors.
- Remove unnecessary timeline item parameters.
- Fix css issues.

## 2.5.0

date: 11/30/2022

- Improve gov2 referenda tracks menu.
- Use the login address to sign extrinsics, and remove address selection.
- Show gov2 referendum tally approval and support threshold.
- Support democracy pallet delegation and refactor democracy section panel.
- Improve treasury list items value display.

## 2.4.7

- Disable background page scrolling when popup is shown.
- Fix theme toggle with react context, while previously we use redux.
- Fix democracy second api call with the latest version.
- Always show gov2 referendum confirmation bar and improve the background color.
- Fix democracy referendum hash introduced by the latest democracy pallet version.

## 2.4.6

- Support gov 2.0 track delegation.
- Turn on gov 2.0 for kusama.
- Add breadcrumb various proposals.
- Sync polkassembly content for gov 2.0 proposals.
- Improve subsquare/polkassembly default comments tab choice.
- Improve child bounty value display.
- Fix page width for some pages including empty overview page, settings page, etc.

## 2.4.5

- Remove @polkadot/api patch for account nonce.
- Remove disabled status for tip endorse.
- Fix nested delegation votes for gov2.
- Fix styles.

## 2.4.4

- Fix treasury new proposal/tip value with string arg.
- Fix nested delegations votes bug.

## 2.4.3

- Support Rococo.
- Fix referenda menu style in mobile.
- Fix page layout of council/TC members and settings page.
- Hotfix menu external link icon style.
- Fix councilor tip extrinsic.

## 2.4.2

- Support gov 2.0.
- Home menu foldable.
- Support TC motion and democracy subscription and notification.

## 2.4.1

- Upgrade dependency of @polkadot/api to 9.6.2.
- Use rpc to query total supply and escrow balance for kintsugi/interlay.

## 2.4.0

- Support treasury and motion notifications.
- Refactor detail pages.
- Add loading effect to thumb up action.
- Set users link to domestic.
- Refactor components.
- Fix councilor check in tip.
- Fix link/unlink address.
- Style fixes and hotfixes.

## 2.3.2

- New network selection drop down menu.
- Fix motion vote number.
- Fix link identity icon.
- Fix tip beneficiary, and tip/bounty timeline by polkadot/api upgrade.
- Improve polkassembly democracy links.
- Fix child bounty beneficiary checking.
- Fix styles.

## 2.3.1

- Use the login web3 address as the default signer for actions.
- Support claiming child bounty.
- Add unsubscription link in notification emails.
- Remove useless user profile query in `Auth` component.
- Fix toast item style.

## 2.3.0

- Add profile page to show user governance activities.
- Add countdown component for tips, child bounties, and bounties.
- Add tip status to the tip card.
- Improve system#remakr view by checking whether bytes are utf8.

## 2.2.5

- Add referendum to treasury proposal's timeline.
- Show motion vote status.
- Fix address login page SSR.
- Fix typo: referendums -> referenda.
- Fix bounty/child bounty award timeline item.
- Hotfix kintsugi/interlay thumbs up expand crash bug.

## 2.2.4

- Support altair.
- Fix twitter share location in post author view.
- Fix tc and council motions on democracy navigation.

## 2.2.3

- Support login with talisman and subwallet.
- Support share post to twitter.

## 2.2.2

- Refactor pagination component.
- Use scanned electorate for vote finished referendum.
- Add all referenda votes.
- Fix typescript markdown preview.
- Support centrifuge and zeitgeist.
- Support copy comment url.
- Style and typo fix.

## 2.2.1

- Add check all councilors and TC members link.
- Fix motion id.
- Fix motion voter, no proposer as default aye vote.
- Fix styles:
    1. Caret color on dark mode.
    2. Markdown text no-wrap.
    3. Tag color

## 2.2.0

- Support dark mode.
- Sync polkassembly discussion posts and all comments for Kusama/Polkadot.
- Code refactor including new layout, tags, buttons, etc.

## 2.1.4

- Support customize poll end data.
- Improve balance loading on treasury proposal modal.
- Fix council/TC members page layout.
- Show extrinsic failed info on toast.
- Support democracy `ProposalCanceled` scan.

## 2.1.3

- Support phala and turn on crust
- Apply OpenSquare editor and markdown renderer
- Refactor icons and remove redundant icons in next and kintsugi-next package
- Hotfix: vote button not shown for council members on motion detail page
- Handle post empty title
- Fix child bounty title and style on parent bounty detail page
- Fix kintsugi/interlay treasury modal balance

## 2.1.2

- Support discussions post polls
- Upgrade dependency to @polkadot/api
- Refactor part of icons

## 2.1.1

- Support set post banner
- Refactor chain settings which will benefit new chain support
- Support centrifuge. Support track motion `fast_track` external proposal.
- Add loading state when setting verification email on email page
- Fix bugs by missing of React imports
- Set all signatories to be the authors of a proposal

## 2.1.0

- Support new network: polkadot, kusama, crab, polkadex, turing
- Replace updated time icon
- Correct interlay vote symbol
- Fix interlay treasury value
- Show council prime voter
- Style fix: bullets, inline code

## 2.0.1

- Support safari >= 14.0
- Fix electorate query
- Show polkassembly lik for polkadot and kusama
- Change kintsugi SNS preview cover
- Fix tip finder

## 2.0.0

- Support Kusama
- Implement did login
- Support safari and improve the compatible page
- Improve public proposal second list
- Fix referendum electorate
- Upgrade dependency to @polkadot/api

## 1.10.4

- Support public proposal second action
- Support proposing treasury proposal
- Support crust and calamari
- Fix the link to 404 page from user without linked address
- Improve timing to close popup when extrinsic is wrapped in block
- Extract common components to better scale democracy vote actions

## 1.10.0

- Prevent error by ethereum address in polkadot extension
- Customize the header for chains
- Refactor code to separate backend from main repo

## 1.9.10

- Add council motion to democracy proposal navigation bar.
- Add pending toast when submitting extrinsic transaction.
- Show referenda at the top of overview page.
- Update @polkadot/api dependency to 7.13.1.

## 1.9.9

- Add accordion effect for detail page metadata/timeline
- Normalize bounty metadata(fixed some value normalization)
- Support interlay
- Support polkadex democracy
- Fix markdown editor memory leak(update unmounted component)

## 1.9.8

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
