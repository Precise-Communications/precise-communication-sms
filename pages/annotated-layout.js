import React,{useState} from "react"
import "./styles.css"
import axios from 'axios'
import form_data from 'form-data'
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
    AppProvider,
    InlineError
  } from '@shopify/polaris';
  import enTranslations from '@shopify/polaris/locales/en.json';


  function AnnotatedLayout()  {

  /**
   * error Declarations
   */
    const[errorStatus,setErrorStatus]=useState(false)
    const[error,setError]=useState()

  /**
   * For Text Changes
   */
  const [signup,setSignup]=useState("NULL")
  const [placed,setPlaced]=useState("NULL")
  const [fulfilled,setFulfilled]=useState("NULL")
  const [canceled,setCanceled]=useState("NULL")
  const [abandoned,setAbandoned]=useState("NULL")
  const [refund,setRefund]=useState("NULL")
  const [SMS,setSMS]=useState("NULL")
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
    if(errorStatus===false){
    const STORE=store.replace(/(^\w+:|^)\/\//, '')
    console.log(STORE,signup,signupChk,placed,placedChk,fulfilled,fulfilledChk,canceled,canceledChk,abandoned,abandonedChk,refund,refundChk,SMS,SMSChk)
    var config = {
      method: 'get',
      url: "https://Precise-Comm-SMS.ishanjirety.repl.co/api/insertuser/"+STORE+"/"+signup+"/"+signupChk+"/"+placed+"/"+placedChk+"/"+fulfilled+"/"+fulfilledChk+"/"+canceled+"/"+canceledChk+"/"+abandoned+"/"+abandonedChk+"/"+refund+"/"+refundChk+"/"+SMS+"/"+SMSChk,
      headers: {}
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    }
    // 
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
    .then(response => response.json())
    .then(result =>{
      if(result.status==="500"){
        console.log(result.response)
        setStore("")
        setErrorStatus(true)
        setError("You might not have logged in. Please log in to store messages")
      }
      else
      {
        setErrorStatus(false)
        console.log(result)
        setStore(result.response.username)
        console.log(result.response)
        onsubmitHandler()        
      }
     
    }).catch(error => console.log('error', error));
    
}
    
      return (
        <AppProvider i18n={enTranslations}>
        <Page className="PageClass">
        {errorStatus && <InlineError message={error} fieldID="myFieldID" /> }
          <Checkbox label="New Customer Signup"     checked={signupChk}  onChange={()=>setSignupChk(!signupChk)}/><TextField onChange={(newValue) => setSignup(newValue)} placeholder="Enter Message" value={signup}           /> <br/>
          <Checkbox label="When Order Is Placed"    checked={placedChk}  onChange={()=>setPlacedChk(!placedChk)} /> <TextField onChange={(newValue) => setPlaced(newValue)}  placeholder="Enter Message" value={placed}       /><br/> 
          <Checkbox label="When Order Is Fulfilled" checked={fulfilledChk}  onChange={()=>setFulfilledChk(!fulfilledChk)}/><TextField  onChange={(newValue) => setFulfilled(newValue)} placeholder="Enter Message" value={fulfilled}   /><br/> 
          <Checkbox label="When Order Is Canceled"  checked={canceledChk}  onChange={()=>setCanceledChk(!canceledChk)}/> <TextField  onChange={(newValue) => setCanceled(newValue)}  placeholder="Enter Message" value={canceled}   /><br/>
          <Checkbox label="SMS for abandoned carts" checked={abandonedChk}  onChange={()=>setAbandonedChk(!abandonedChk)}/>  <TextField  onChange={(newValue) => setAbandoned(newValue)}  placeholder="Enter Message" value={abandoned}/><br/>
          <Checkbox label="When Order is refunded"  checked={refundChk}  onChange={()=>setRefundChk(!refundChk)}/><TextField  onChange={(newValue) => setRefund(newValue)}  placeholder="Enter Message" value={refund}      /><br/> 
          <Checkbox label="Marketing SMS"           checked={SMSChk}  onChange={()=>setSMSChk(!SMSChk)}/><TextField  onChange={(newValue) => setSMS(newValue)}  placeholder="Enter Message" value={SMS}                  />
          <br/>
          <div className="button"><Button primary type="submit" onClick={getName}>Save</Button></div>
          <Button destructive onClick={onClickHandler} >Cancel</Button>
        </Page>
        </AppProvider>
      );
  }
  
  
  export default AnnotatedLayout;