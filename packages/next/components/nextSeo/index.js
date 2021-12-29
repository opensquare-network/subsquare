import Head from "next/head";
import React, { Component } from "react";
import buildTags from "./buildTags";

export default class NextSeo extends Component {
  render() {
    const {
      title,
      noindex = false,
      nofollow,
      robotsProps,
      description,
      canonical,
      openGraph,
      facebook,
      twitter,
      additionalMetaTags,
      titleTemplate,
      mobileAlternate,
      languageAlternates,
      additionalLinkTags,
      disableGooglebot,
    } = this.props;

    return (
      <Head>
        {buildTags({
          title,
          noindex,
          nofollow,
          robotsProps,
          description,
          canonical,
          facebook,
          openGraph,
          additionalMetaTags,
          twitter,
          titleTemplate,
          mobileAlternate,
          languageAlternates,
          additionalLinkTags,
          disableGooglebot,
        })}
      </Head>
    );
  }
}
