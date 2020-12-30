require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
// const getSubscriptionUrl = require('./server/getSubscriptionUrl');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
var registration
const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products','read_customers','read_orders'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        /** 
         * These Function Will Register Web Hooks 
         * And will trigger Events when called
        */

        /*__________________________________________________________________________________*/

        // Create Order
        registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/create`,
          topic: 'ORDERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Order Creation!', registration);
        } else {
          console.log('Failed to register webhook For Order Creation!', registration.result);
        }
        
       /*__________________________________________________________________________________*/

        // Cancel Order
        registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/cancelled`,
          topic: 'ORDERS_CANCELLED',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Order Cancellation!', registration);
        } else {
          console.log('Failed to register webhook For Order Cancellation!', registration.result);
        }
        /*__________________________________________________________________________________*/

         // Order Fulfillment
         registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/fulfilled`,
          topic: 'ORDERS_FULFILLED',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Order fulfilled!', registration);
        } else {
          console.log('Failed to register webhook For Order fulfilled!', registration.result);
        }
        
       /*__________________________________________________________________________________*/
       
         // Order Delete
         registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/delete`,
          topic: 'ORDERS_DELETE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Order Delete!', registration);
        } else {
          console.log('Failed to register webhook For Order Delete!', registration.result);
        }
        
       /*__________________________________________________________________________________*/

        // Refunds Create
        registration = await registerWebhook({
          address: `${HOST}/webhooks/refunds/create`,
          topic: 'REFUNDS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Refund Creation!', registration);
        } else {
          console.log('Failed to register webhook For Refund Creation!', registration.result);
        }
        /*__________________________________________________________________________________*/
        
        // Carts Update
        registration = await registerWebhook({
          address: `${HOST}/webhooks/carts/update`,
          topic: 'CARTS_UPDATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Carts Update!', registration);
        } else {
          console.log('Failed to register webhook For Carts Update!', registration.result);
        }

        /*__________________________________________________________________________________*/
        
        // Create Customer
        registration = await registerWebhook({
          address: `${HOST}/webhooks/customers/create`,
          topic: 'CUSTOMERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success) {
          console.log('Successfully registered webhook For Customer Creation!', registration);
        } else {
          console.log('Failed to register webhook For Customer Creation!', registration.result);
        }
        /*__________________________________________________________________________________*/

          // App Uninstalled
          registration = await registerWebhook({
            address: `${HOST}/webhooks/app/uninstalled`,
            topic: 'APP_UNINSTALLED',
            accessToken,
            shop,
            apiVersion: ApiVersion.July20
          });
          if (registration.success) {
            console.log('Successfully registered webhook For App Uninstalled!', registration);
          } else {
            console.log('Failed to register webhook For App Uninstalled!', registration.result);
          }
          /*__________________________________________________________________________________*/

      }
      
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });
  
  

  /*__________________________________________Orders________________________________________*/

  /**
   * These Functions Will listen to events and 
   * will take appropriate actions
   */
  
  //  ---> Order Placement 
  // Order Placed
  router.post('/webhooks/orders/create', webhook, (ctx) => {
    console.log("------------------Create Order----------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("------------------Create Order----------------------")
  });

  /*__________________________________________________________________________________*/
  // ---> Cancel Order
  // Cancel Order
  router.post('/webhooks/orders/cancelled', webhook, (ctx) => {
    console.log("-------------------Order Cancelled---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Order Cancelled---------------------")
  });

  /*__________________________________________________________________________________*/

  // ---> Order Fulfilled
  // Order Fulfilled
  router.post('/webhooks/orders/fulfilled', webhook, (ctx) => {
    console.log("-------------------Order Fulfilled---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Order Fulfilled---------------------")
  });

  /*__________________________________________________________________________________*/
  // ---> Order Delete
  // Order Delete
  router.post('/webhooks/orders/delete', webhook, (ctx) => {
    console.log("-------------------Order Delete---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Order Delete---------------------")
  });

  /*__________________________________________________________________________________*/

   // Refund Create
   router.post('/webhooks/refunds/create', webhook, (ctx) => {
    console.log("-------------------Refunds Create---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Refunds Create---------------------")
  });

  /*______________________________________________Cart____________________________________*/

  // Carts Update
  router.post('/webhooks/carts/update', webhook, (ctx) => {
    console.log("-------------------Carts Update---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Carts Update---------------------")
  });

  /*_______________________________________________Customer___________________________________*/
  // ---> Customer Account Creation
  // Customer Creation
  router.post('/webhooks/customers/create', webhook, (ctx) => {
    console.log("-------------------Customer Create---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------Customer Create---------------------")
  });

  /*________________________________________________APP__________________________________*/


   // App Uninstall 
   router.post('/webhooks/app/uninstalled', webhook, (ctx) => {
    console.log("-------------------App Uninstalled---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // Do Something ...
    console.log("-------------------App Uninstalled---------------------")
  });

  /*__________________________________________________________________________________*/

  // These Functions Will Respond 200OK To Shopify Server Within 5 Secs
  server.use(graphQLProxy({ version: ApiVersion.July20 }));       //GraphQL Admin API

  router.get('(.*)', verifyRequest(), async (ctx) => {    // Sending Response 
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());   
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});