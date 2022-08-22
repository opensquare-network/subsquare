export const getShare2SNStext = (post, type) => {
  //todo : this is pesudo
  const { title, author } = post;
  const shareText = `${title} - ${author}`;
  return shareText;
};
