const getSubscriptionUrl = async (ctx, accessToken, shop) => {
  const confirmationUrl = `https://${shop}/admin/apps/precise-communication-sms-1/index`
  return ctx.redirect(confirmationUrl)
};

module.exports = getSubscriptionUrl;