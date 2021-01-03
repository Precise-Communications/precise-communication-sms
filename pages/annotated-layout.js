import React,{useState} from "react"
import "./styles.css"
import {
    Button,
    Card,
    Form,
    FormLayout,
    Layout,
    SettingToggle,
    Page,
    Stack,
    TextField,
    TextStyle,
    Checkbox,
    AppProvider
  } from '@shopify/polaris';
  import enTranslations from '@shopify/polaris/locales/en.json';


  function AnnotatedLayout()  {
  /**
   * For Text Changes
   */
  const [signup,setSignup]=useState("")
  const [placed,setPlaced]=useState("")
  const [fulfilled,setFulfilled]=useState("")
  const [canceled,setCanceled]=useState("")
  const [abandoned,setAbandoned]=useState("")
  const [refund,setRefund]=useState("")
  const [SMS,setSMS]=useState("")
  /**
   * for checkbox Changes
   */
  const [signupChk,setSignupChk]=useState(true)
  const [placedChk,setPlacedChk]=useState(true)
  const [fulfilledChk,setFulfilledChk]=useState(true)
  const [canceledChk,setCanceledChk]=useState(true)
  const [abandonedChk,setAbandonedChk]=useState(true)
  const [refundChk,setRefundChk]=useState(true)
  const [SMSChk,setSMSChk]=useState(true)
  const [store,setStore]=useState("")

  /**
   * Cancel Button Clicked
   */
  function onClickHandler(){
    setSignup("")
    setPlaced("")
    setFulfilled("")
    setCanceled("")
    setAbandoned("")
    setRefund("")
    setSMS("")
  }
  /**
   * Submit Button Clicked
   */

  //  This Function Will Post Data In Particular Collection
  function onsubmitHandler(){
    getName()
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };
  const STORE=store.replace(/(^\w+:|^)\/\//, '')
  const URL="https://Precise-Comm-SMS.ishanjirety.repl.co/api/"+STORE+"/"+signup+"/"+signupChk+"/"+placed+"/"+placedChk+"/"+fulfilled+"/"+fulfilledChk+"/"+canceled+"/"+canceledChk+"/"+abandoned+"/"+abandonedChk+"/"+refund+"/"+refundChk+"/"+SMS+"/"+SMSChk

  fetch(URL, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Function Will Get Name Of Store In Which It Has to be stored
function getName(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const DUMMY_URL=window.location.ancestorOrigins.item(0);
  var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
  fetch("https://precise-comm-sms.ishanjirety.repl.co/api/select/"+SHOP_URL, requestOptions)
    .then(response => response.text())
    .then(result =>{
     console.log(result.response.username)
     setStore(result.response.username)
    })
    .catch(error => console.log('error', error));
}
    
      return (
        <AppProvider i18n={enTranslations}>
        <Page className="PageClass">
          <Checkbox label="New Customer Signup"     checked={signupChk}  onChange={()=>setSignupChk(!signupChk)}/><TextField onChange={(newValue) => setSignup(newValue)} placeholder="Enter Message" value={signup}           /> <br/>
          <Checkbox label="When Order Is Placed"    checked={placedChk}  onChange={()=>setPlacedChk(!placedChk)} /> <TextField onChange={(newValue) => setPlaced(newValue)}  placeholder="Enter Message" value={placed}       /><br/> 
          <Checkbox label="When Order Is Fulfilled" checked={fulfilledChk}  onChange={()=>setFulfilledChk(!fulfilledChk)}/><TextField  onChange={(newValue) => setFulfilled(newValue)} placeholder="Enter Message" value={fulfilled}   /><br/> 
          <Checkbox label="When Order Is Canceled"  checked={canceledChk}  onChange={()=>setCanceledChk(!canceledChk)}/> <TextField  onChange={(newValue) => setCanceled(newValue)}  placeholder="Enter Message" value={canceled}   /><br/>
          <Checkbox label="SMS for abandoned carts" checked={abandonedChk}  onChange={()=>setAbandonedChk(!abandonedChk)}/>  <TextField  onChange={(newValue) => setAbandoned(newValue)}  placeholder="Enter Message" value={abandoned}/><br/>
          <Checkbox label="When Order is refunded"  checked={refundChk}  onChange={()=>setRefundChk(!refundChk)}/><TextField  onChange={(newValue) => setRefund(newValue)}  placeholder="Enter Message" value={refund}      /><br/> 
          <Checkbox label="Marketing SMS"           checked={SMSChk}  onChange={()=>setSMSChk(!SMSChk)}/><TextField  onChange={(newValue) => setSMS(newValue)}  placeholder="Enter Message" value={SMS}                  />
          <br/>
          <div className="button"><Button primary type="submit" onClick={onsubmitHandler}>Save</Button></div>
          <Button destructive onClick={onClickHandler} >Cancel</Button>
        </Page>
        </AppProvider>
      );
  }
  
  
  export default AnnotatedLayout;