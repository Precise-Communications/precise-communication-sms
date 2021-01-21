const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  const confirmationUrl = `https://${shop}/admin/apps`
  return ctx.redirect(confirmationUrl)
};

module.exports = getSubscriptionUrl;