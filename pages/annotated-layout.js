import React,{useState,useEffect} from "react"
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
    InlineError,
    Link
  } from '@shopify/polaris';
  import enTranslations from '@shopify/polaris/locales/en.json';


  function AnnotatedLayout()  {

  /**
   * error Declarations
   */
    const[errorStatus,setErrorStatus]=useState(false)
    const[error,setError]=useState()
    const [respo,setRespo]=useState()

  /**
   * For Text Changes
   */
  const [signup,setSignup]=useState("Thank you [[first_name]] for signing up with [[shop_domain]]! Have an awesome shopping experience with us.")
  const [placed,setPlaced]=useState("Hey [[first_name]], thanks for your purchase of [[currency]] [[Amount]] from [[shop_domain]]!")
  const [fulfilled,setFulfilled]=useState("Hey [[first_name]] thanks for your purchase, we are happy to inform you that your order has been fulfilled.")
  const [canceled,setCanceled]=useState("Your order from [[shop_domain]] has been cancelled. We'll notify you once the refund is initiated.")
  const [abandoned,setAbandoned]=useState("Hey [[first_name]], we noticed that you added [[product]] to your cart but didn’t check out.")
  const [refund,setRefund]=useState("Hey your request for refund of [[order_id]] has been fulfilled.")
  const [SMS,setSMS]=useState("FLAT [[discount]] OFF welcome offer @[[shop_domain]]. Offer valid till 15-jan-21")
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
  function onsubmitHandler(storename){
    if(errorStatus===false){
    const STORE=storename.replace(/(^\w+:|^)\/\//, '')
    // console.log(STORE,signup,signupChk,placed,placedChk,fulfilled,fulfilledChk,canceled,canceledChk,abandoned,abandonedChk,refund,refundChk,SMS,SMSChk)
    var config = {
      method: 'get',
      url: "https://precise-communications-api.herokuapp.com/api/truncate/"+STORE,
      headers: {}
    };
    axios(config)
    .then(function (response) {
      // console.log(response.data.status)
      if(response.data.status==="200"){
        // Inserting Messages if STATUS is 200 OK
        // console.log(response.data.status)
        var config = {
          method: 'get',
          url: "https://precise-communications-api.herokuapp.com/api/insertuser/"+STORE+"/"+signup+"/"+signupChk+"/"+placed+"/"+placedChk+"/"+fulfilled+"/"+fulfilledChk+"/"+canceled+"/"+canceledChk+"/"+abandoned+"/"+abandonedChk+"/"+refund+"/"+refundChk+"/"+SMS+"/"+SMSChk,
          headers: {}
        };
        axios(config)
        .then(function (response) {
        //  console.log(JSON.stringify(response));
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    })
    //Main .then Catch Block
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
  fetch("https://precise-communications-api.herokuapp.com/api/select/"+SHOP_URL, requestOptions)
    .then(response => response.json())
    .then(result =>{
      if(result.status==="500" || result.response.status==="logged_out"){
        // console.log(result.response)
        setStore("")
        setErrorStatus(true)
        setError("You might not have logged in. Please log in to store messages")
      }
      else
      {
        setErrorStatus(false)
        // console.log(result)
        setStore(result.response.store_name)
        onsubmitHandler(result.response.store_name)        
      }
     
    }).catch(error => {
      // console.log('error', error)
    });
    
}
// Var Appending
function varSignup(e){
  const VarValue=e.target.innerText
  setSignup(signup+VarValue)
}
function varPlaced(e){
  const VarValue=e.target.innerText
  setPlaced(placed+VarValue)
}
function varFulfilled(e){
  const VarValue=e.target.innerText
  setFulfilled(fulfilled+VarValue)
}
function varCanceled(e){
  const VarValue=e.target.innerText
  setCanceled(canceled+VarValue)
}
function varAbandoned(e){
  const VarValue=e.target.innerText
  setAbandoned(abandoned+VarValue)
}
function varRefunded(e){
  const VarValue=e.target.innerText
  setRefund(refund+VarValue)
}
function varSMS(e){
  const VarValue=e.target.innerText
  setSMS(SMS+VarValue)
}
      
      useEffect(() => {
      (async function getTemplates(){
        let DUMMY_URL =""
        if(document.location.ancestorOrigins.item(0)==="null" || document.location.ancestorOrigins.item(0)===null || document.location.ancestorOrigins.item(0)===undefined) {
          DUMMY_URL= document.location.host;
        }
        else{
          DUMMY_URL= document.location.ancestorOrigins.item(0);
        }
        //
        var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
        const {data:{message}} = await axios.get("https://precise-communications-api.herokuapp.com/api/get-messages/"+SHOP_URL)
        if(message){
            setSignup(message.account_creation)
            setSignupChk(message.account_status === "true" ? true : false)

            setPlaced(message.order_creation)
            setPlacedChk(message.order_status === "true" ? true : false)

            setFulfilled(message.order_fulfillment)
            setFulfilledChk(message.fulfillment_status === "true" ? true : false)

            setCanceled(message.order_cancel)
            setCanceledChk(message.cancel_status === "true" ? true : false)
            
        }
      })()
    }, [])
      return (
        <AppProvider i18n={enTranslations}>
          <div className="warpper">
        {/* <Page className="PageClass"> */}
        {errorStatus && <InlineError message={error} fieldID="myFieldID" /> }
        {/* Signup Message Start */}
          <Checkbox label="New Customer Signup"     checked={signupChk}  onChange={()=>setSignupChk(!signupChk)}/>
          <br/>
          <Link onClick={varSignup} >[[first_name]]</Link><span> | </span>
          <Link onClick={varSignup} >[[last_name]]</Link><span> | </span>
          <Link onClick={varSignup} >[[email]]</Link><span> | </span>
          <Link onClick={varSignup} >[[shop_name]]</Link><span> | </span>
          <Link onClick={varSignup} >[[shop_domain]]</Link>
          <TextField helpText="" onChange={(newValue) => setSignup(newValue)} placeholder="Enter Message" value={signup} maxLength={140} showCharacterCount/> <br/>
        {/* Signup Message End */}

        {/* Placed Message Start */}
          <Checkbox label="When Order Is Placed"    checked={placedChk}  onChange={()=>setPlacedChk(!placedChk)} /> 
          <br/>
          <Link onClick={varPlaced}>[[first_name]]</Link><span> | </span>
          <Link onClick={varPlaced}>[[last_name]]</Link><span> | </span>
          <Link onClick={varPlaced}>[[email]]</Link><span> | </span>
          <Link onClick={varPlaced}>[[shop_name]]</Link><span> | </span>
          <Link onClick={varPlaced}>[[shop_domain]]</Link>
          <TextField helpText="" onChange={(newValue) => setPlaced(newValue)}  placeholder="Enter Message" value={placed} maxLength={140} showCharacterCount/><br/> 
        {/* Placed Message Starhttps://www.canva.com/design/DAEbc3SPbcE/0KPNlOdTJ8CqXnJdRfUmHQ/edit?layoutQuery=makeup+workshopt */}

        {/* Fulfilled Message Start */}
          <Checkbox label="When Order Is Fulfilled" checked={fulfilledChk}  onChange={()=>setFulfilledChk(!fulfilledChk)}/>
          <br/>
          <Link onClick={varFulfilled}>[[first_name]]</Link><span> | </span>
          <Link onClick={varFulfilled}>[[last_name]]</Link><span> | </span>
          <Link onClick={varFulfilled}>[[email]]</Link><span> | </span>
          <Link onClick={varFulfilled}>[[shop_name]]</Link><span> | </span>
          <Link onClick={varFulfilled}>[[shop_domain]]</Link>
          <TextField helpText=""  onChange={(newValue) => setFulfilled(newValue)} placeholder="Enter Message" value={fulfilled} maxLength={140} showCharacterCount /><br/> 
        {/* Fulfilled Message Start */}

        {/* Canceled Message Start */}
          <Checkbox label="When Order Is Cancelled"  checked={canceledChk}  onChange={()=>setCanceledChk(!canceledChk)}/> 
          <br/>

          <Link onClick={varCanceled}>[[first_name]]</Link><span> | </span>
          <Link onClick={varCanceled}>[[last_name]]</Link><span> | </span>
          <Link onClick={varCanceled}>[[email]]</Link><span> | </span>
          <Link onClick={varCanceled}>[[shop_name]]</Link><span> | </span>
          <Link onClick={varCanceled}>[[shop_domain]]</Link>
          <TextField helpText=""  onChange={(newValue) => setCanceled(newValue)}  placeholder="Enter Message" value={canceled}  maxLength={140} showCharacterCount/><br/>
        {/* Canceled Message Start */}

        {/* Abandoned Message Start */}
        {/* ****************************************************************************************************** */}
          {/* <Checkbox label="SMS for abandoned carts" checked={abandonedChk}  onChange={()=>setAbandonedChk(!abandonedChk)}/> 
          <br/>
          <Link onClick={varAbandoned}>[[first_name]]</Link><span> | </span>
          <Link onClick={varAbandoned}>[[last_name]]</Link><span> | </span>
          <Link onClick={varAbandoned}>[[email]]</Link><span> | </span>
          <Link onClick={varAbandoned}>[[shop_name]]</Link><span> | </span>
          <Link onClick={varAbandoned}>[[shop_domain]]</Link> 
          <TextField helpText=""  onChange={(newValue) => setAbandoned(newValue)}  placeholder="Enter Message" value={abandoned} maxLength={140} showCharacterCount/><br/> */}
          {/* ****************************************************************************************************** */}
        {/* Abandoned Message Start */}

        {/* Refunded Message Start */}
        {/* ****************************************************************************************************** */}
          {/* <Checkbox label="When Order is refunded"  checked={refundChk}  onChange={()=>setRefundChk(!refundChk)}/>
          <br/>

          <Link onClick={varRefunded}>[[order_id]]</Link>
          <TextField helpText=""  onChange={(newValue) => setRefund(newValue)}  placeholder="Enter Message" value={refund} maxLength={140} showCharacterCount/><br/>  */}
          {/* ****************************************************************************************************** */}
        {/* Refunded Message Start */}

        {/* Marketing Message Start */}
          {/* <Checkbox label="Marketing SMS"           checked={SMSChk}  onChange={()=>setSMSChk(!SMSChk)}/>
          <br/>
          <TextField helpText=""  onChange={(newValue) => setSMS(newValue)}  placeholder="Enter Message" value={SMS} maxLength={140} showCharacterCount/> */}
        {/* Marketing Message Start */}
          <br/>
          <div className="button"><Button primary type="submit" onClick={getName}>Save</Button></div>
          <Button destructive onClick={onClickHandler} >Cancel</Button>
        {/* </Page> */}
        </div>
        </AppProvider>
      );
  }
  
  
  export default AnnotatedLayout;
