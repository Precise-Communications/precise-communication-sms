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
const { default: Shopify } = require('@shopify/shopify-api');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');

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
      scopes: ['read_products','read_customers','read_orders'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        console.log(ctx.cookies.get("shopOrigin"))
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
          // await getSubscriptionUrl(ctx, accessToken, shop);
          const urlParams = new URLSearchParams(ctx.request.url);
          const shopNew = urlParams.get('shop');
          
          //  ctx.redirect(`/?shop=${shopNew}`);

          // @desc Enabling Subscription
          // const returnUrl = `/?shop=${shopNew}`;
         await getSubscriptionUrl(ctx, accessToken, shop);
          // ctx.redirect(subscriptionUrl);
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
  router.post('/webhooks/orders/create', webhook, async (ctx) => {
    console.log("------------------Create Order----------------------")
    // console.log('received webhook: ', ctx.state.webhook.payload);
    console.log('received webhook: ', ctx.state.webhook);
    const msg = await GetMessage(ctx.state.webhook.domain,"order_creation","order_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("------------------Create Order----------------------")
  });

  /*__________________________________________________________________________________*/
  // ---> Cancel Order
  // Cancel Order
  router.post('/webhooks/orders/cancelled', webhook, (ctx) => {
    console.log("-------------------Order Cancelled---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    GetMessage(ctx.state.webhook.domain,"order_cancel","cancel_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------Order Cancelled---------------------")
  });

  /*__________________________________________________________________________________*/

  // ---> Order Fulfilled
  // Order Fulfilled
  router.post('/webhooks/orders/fulfilled', webhook, (ctx) => {
    console.log("-------------------Order Fulfilled---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    GetMessage(ctx.state.webhook.domain,"order_fulfillment","fulfillment_status",ctx.state.webhook.topic,ctx.state.webhook)
   
    // Do Something ...
    console.log("-------------------Order Fulfilled---------------------")
  });

  /*__________________________________________________________________________________*/
  // ---> Order Delete
  // Order Delete
  router.post('/webhooks/orders/delete', webhook, (ctx) => {
    console.log("-------------------Order Delete---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    // GetMessage(ctx.state.webhook.domain,"order_cancel","cancel_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------Order Delete---------------------")
  });

  /*__________________________________________________________________________________*/

   // Refund Create
   router.post('/webhooks/refunds/create', webhook, (ctx) => {
    console.log("-------------------Refunds Create---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    // GetMessage(ctx.state.webhook.domain,"order_refund","refund_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------Refunds Create---------------------")
  });

  /*______________________________________________Cart____________________________________*/

  // Carts Update
  router.post('/webhooks/carts/update', webhook, (ctx) => {
    console.log("-------------------Carts Update---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    GetMessage(ctx.state.webhook.domain,"abandoned_cart","abandoned_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------Carts Update---------------------")
  });

  /*_______________________________________________Customer___________________________________*/
  // ---> Customer Account Creation
  // Customer Creation
  router.post('/webhooks/customers/create', webhook, (ctx) => {
    console.log("-------------------Customer Create---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    GetMessage(ctx.state.webhook.domain,"account_creation","account_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------Customer Create---------------------")
  });

  /*________________________________________________APP__________________________________*/


   // App Uninstall 
   router.post('/webhooks/app/uninstalled', webhook, (ctx) => {
    console.log("-------------------App Uninstalled---------------------")
    console.log('received webhook: ', ctx.state.webhook.payload);
    // GetMessage(ctx.state.webhook.domain,"order_cancel","cancel_status",ctx.state.webhook.topic,ctx.state.webhook)
    // Do Something ...
    console.log("-------------------App Uninstalled---------------------")
  });
  /*__________________________________________________________________________________*/

  router.post('/webhooks/customers/redact', webhook, (ctx) => {
    console.log("-------------------CUSTOMER REDACT---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    // Do Something ...
    console.log("-------------------CUSTOMER REDACT---------------------")
  });
/*__________________________________________________________________________________*/
  router.post('/webhooks/shop/redact', webhook, (ctx) => {
    console.log("-------------------SHOP REDACT---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    // Do Something ...
    console.log("-------------------SHOP REDACT---------------------")
  });
  /*__________________________________________________________________________________*/

  router.post('/webhooks/customers/data_request', webhook, (ctx) => {
    console.log("-------------------DATA REDACT---------------------")
    console.log('received webhook: ', ctx.state.webhook);
    // Do Something ...
    console.log("-------------------DATA REDACT---------------------")
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


// For Recieving Messages
function GetMessage(url,hookCalled,hookStatus,topic,webhook){
  console.log("CALLED")
  var USERNAME
  var PASSWORD
  var SENDER_ID
  const URL="https://precise-communications-api.herokuapp.com/api/select_message/"+url+"/"+hookCalled+"/"+hookStatus
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(URL, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      console.log(url)
      fetch("https://precise-communications-api.herokuapp.com/api/select/"+url,requestOptions)
      .then(response=>response.json())
      .then(json=>{
        USERNAME=json.response.username
        PASSWORD=json.response.password
        SENDER_ID=json.response.senderName
        console.log(USERNAME+" " +PASSWORD+ " " +SENDER_ID)
         replaceMessage_send(topic,result.message,webhook,result.message_staus,USERNAME,PASSWORD,SENDER_ID)
      })
    })
    .catch(error => console.log('error', error));
}

/**
 * have to check if user is logged in or not 
 * have to check if user has set messages in DB
 * then replace all the place holders
 */

function replaceMessage_send(topic,message,webhook,status,USERNAME,PASSWORD,SENDER_ID){
  var MESSAGE=""
  console.log(status)
  switch(topic){
  case "ORDERS_CREATE":
    console.log("ORDERS_CREATE")
    const first_name=webhook.payload.billing_address.first_name
    const last_name=webhook.payload.billing_address.last_name
    const email=webhook.payload.email
    const domain=webhook.domain
    const currency=webhook.payload.customer.currency
    const amount=webhook.payload.total_price
    
    MESSAGE=message.replace("[[first_name]]",first_name)
                   .replace("[[last_name]]",last_name)
                   .replace("[[email]]",email)
                   .replace("[[shop_domain]]",domain)
                   .replace("[[currency]]",currency)
                   .replace("[[Amount]]",amount)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;
  
  case "ORDERS_CANCELLED":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.billing_address.first_name)
    .replace("[[last_name]]",webhook.payload.billing_address.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          console.log(MESSAGE)
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        console.log(MESSAGE)
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;

  case "ORDERS_FULFILLED":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.billing_address.first_name)
    .replace("[[last_name]]",webhook.payload.billing_address.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;

  case "ORDERS_DELETE":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.billing_address.first_name)
    .replace("[[last_name]]",webhook.payload.billing_address.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          console.log(MESSAGE)
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        console.log(MESSAGE)
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;
  //Changed Order_id var

  case "REFUNDS_CREATE":
    MESSAGE=message.replace("[[order_id]]",webhook.payload.order_id)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          console.log(MESSAGE)
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        console.log(MESSAGE)
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;

  case "CARTS_UPDATE":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.billing_address.first_name)
    .replace("[[last_name]]",webhook.payload.billing_address.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
   PHONE_NUMBER=webhook.payload.customer.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          console.log(MESSAGE)
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        console.log(MESSAGE)
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;

  case "CUSTOMERS_CREATE":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.first_name)
    .replace("[[last_name]]",webhook.payload.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
   PHONE_NUMBER=webhook.payload.phone
    if(PHONE_NUMBER !== null){
    if(status==="true"){
          console.log(MESSAGE)
          var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        console.log(MESSAGE)
        fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        console.log(MESSAGE)
    }
    else{
      console.log("Message Status", status)
    }
  }
  break;

  case "APP_UNINSTALLED":
    MESSAGE=message
    .replace("[[first_name]]",webhook.payload.billing_address.first_name)
    .replace("[[last_name]]",webhook.payload.billing_address.last_name)
    .replace("[[email]]",webhook.payload.email)
    .replace("[[shop_domain]]",webhook.domain)
    
   PHONE_NUMBER=webhook.payload.phone
   if(PHONE_NUMBER !== null || PHONE_NUMBER !==''){
   if(status==="true"){
         console.log(MESSAGE)
         var requestOptions = {
         method: 'GET',
         redirect: 'follow'
       };
       
       console.log(MESSAGE)
       fetch("https://precise-communications-api.herokuapp.com/api/sendSMS/"+USERNAME+"/"+PASSWORD+"/"+SENDER_ID+"/"+MESSAGE+"/"+PHONE_NUMBER, requestOptions)
         .then(response => response.text())
         .then(result => console.log(result))
         .catch(error => console.log('error', error));
       console.log(MESSAGE)
   }
   else{
     console.log("Message Status", status)
   }
 }

  break;
  
  }
  // https://testyhideoussection.ishanjirety.repl.co/api/sendSMS/testsms/TST@2020/Dear%20Customer%20Your%20order%20is%20canceled/971502738190
// if(MESSAGE===""){}
// else{
//   var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
//   };
  
//   console.log(MESSAGE)
//   fetch("https://testyhideoussection.ishanjirety.repl.co/api/sendSMS/testsms/TST@2020/"+MESSAGE+"/971502738190", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
//   console.log(MESSAGE)
// }

}
