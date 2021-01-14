import React,{useState,useEffect} from "react"
import {AppProvider,TextField,Button,InlineError,Banner,Card,FormLayout,Heading,Badge,Stack,EmptyState, Layout, Page} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import "./styles.css"
import axios from 'axios'
import form_data from 'form-data'
const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';
const URL="https://restapi.tobeprecisesms.com/api/Credits/GetBalance/"

var credits

function Index(){
 
//  constructor(props) {
//    super(props)
//    this.state = {
//       username:"",
//       password:"",
//       credits:"0",
//       Credentials:"False",
//       error:true
//    }
//  }

  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [credits,setCredits]=useState("")
  const [error,setError]=useState(false)
  const [credentials,setCredentials]=useState("")
  const [message,setMessage]=useState("Incorrect username/password")
  const [btn,setBtn]=useState(true)
  const [senderName,setSenderName]=useState("")
  const [check,setCheck]=useState(false)
  const [EnrtyStatus,setEntryStatus]=useState()
  const [ShopName,setShopName]=useState("")
  const [MarketingID,setMarketingSenderName]=useState("")
  // Creating User Table Entry

  function CreateUser(){
    //Check If User EXISTS

    if (EnrtyStatus==="logged_out" ||  EnrtyStatus==="logged_in"){
      console.log(EnrtyStatus)
      const STATUS = "logged_in";
      const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/update/"+username+"/"+STATUS
      var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(URL, requestOptions)
      .then(response => response.json())
      .then(result => {
        setUsername("")
        setPassword("")
        setSenderName("")
        // console.log(result)
        setBtn(false)
      })
      .catch(error => console.log('error', error));
    }

    // If User Does Not Exist Make User Entry
    else{
      // console.log(EnrtyStatus)
    const DUMMY_URL=window.location.ancestorOrigins.item(0);
    var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
    // console.log(JSON.stringify(SHOP_URL))
    const USERNAME=username;
    const PASSWORD=password;
    const SHOP_NAME=SHOP_URL.replace(".myshopify.com","");
    setShopName(SHOP_NAME)
    const STATUS="logged_in";
    const SENDER_NAME=senderName
    const MARK_SMS=MarketingID
    // console.log(SENDER_NAME)
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/insert/"+USERNAME+"/"+PASSWORD+"/"+senderName+"/"+MarketingID+"/"+SHOP_NAME+"/"+JSON.stringify(SHOP_URL)+"/"+STATUS

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(URL, requestOptions)
      .then(response => response.text())
      .then(result => {
        CreateTable(SHOP_NAME)
        setBtn(false)
      })
      .catch(error => console.log('error', error));
    }
  }
  // Creating Table If user Authenticated
  function CreateTable(shopname){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    // console.log(shopname)
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/create/"+shopname;
    fetch(URL, requestOptions)
      .then(response => response.text())
      // .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
  function onSubmitHandler(e){
    e.preventDefault()
    if((username==="" && password==="")||(username==="")||(password==="")){
      // Show Error
     setError(true)
     setMessage("Please enter credentials")
    }
    else{
   fetch("https://precise-comm-sms.ishanjirety.repl.co/api/credits/"+username+"/"+password)
            .then(response=>response.json())
            .then(json=>{
                        if(json.status==="OK"){
                        setCredits(json.data.balance)
                        setCredentials("True");
                        setError(false)
                        
                        // console.log(window.location.ancestorOrigins.item(0)); // To get Current Url Of SHOP

                        /**
                         * to send 
                         * this.state.username
                         * this.state.password
                         * window.location.ancestorOrigins.item(0)
                         * status:True|False|Deactive 
                         * send this data to Users Table And create a separate table for messages with Table Name="username"
                         * call Repl API for User Insertion With ALL THE ENTRIES
                         * then call Repl API for Table Creation
                         */
                        CreateUser()               
                        setBtn(true)
                        }
                        else{
                          setCredentials("False");
                          setCredits("")
                          setError(true)
                          setMessage("Incorrect username/password")
                        }
                        })
                      }
  }
  // Logging Out User
  function LogOutHandler(){
    const STATUS = "logged_out";
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/update/"+username+"/"+STATUS
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(URL, requestOptions)
      .then(response => response.json())
      .then(result => {
        setUsername("")
        setPassword("")
        setSenderName("")
        // console.log(result)
        setBtn(true)
      })
      .catch(error => console.log('error', error));
  }
/**
 * Check If User Is loggedIn
 */


useEffect(async function CheckUserStatus(){
  setBtn(true)
  var DUMMY_URL
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  if(document.location.ancestorOrigins.item(0)==="null"){
   DUMMY_URL= document.location.host;
  }
  else{
     DUMMY_URL= document.location.ancestorOrigins.item(0);
  }
  //
  var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
  // console.log(SHOP_URL)
  fetch("https://precise-comm-sms.ishanjirety.repl.co/api/select/"+SHOP_URL, requestOptions)
    .then(response => response.json())
    .then(result =>{
        // console.log(result)
        if (result.status==="500" || result.response.status==="logged_out"){
          setUsername("")
          setPassword("")
          setSenderName("")
          setCredits("")
          setCheck(false)
          setBtn(true)
          setEntryStatus(result.response.status)
        }
        else{
          setSenderName(result.response.senderName)
          setMarketingSenderName(result.response.MarketingID)
          setUsername(result.response.username)
          setPassword(result.response.password)
          setCheck(true)
          setBtn(false)
          setEntryStatus(result.response.status)
        }
    }).catch(error => console.log('error', error));
    return <div></div>
},[])

      // const [error,setError]=useState("false")
    return (
      <AppProvider i18n={enTranslations}>
    <div>
     <Card title="Available Credits" sectioned>
  <h3>{credits}</h3>
    </Card>
    <br/>
    <form onSubmit={onSubmitHandler}>
    <section className="form-class">
    <div className="SenderID">
    <TextField 
      name="sendername"
      label="Sender ID"
      value={senderName}
      placeholder="Enter Sender Name"
      disabled={false}
      onChange={(newValue) => setSenderName(newValue.replace(/(^\w+:|^)\/\//, '').replace("*",'').replace("*",'').replace("<",'').replace(">",''))}
      disabled={!btn}
      id="username"
    /></div>
       <div className="SenderID">
    <TextField 
      name="sendernameMarketing"
      label="Marketing Sender ID"
      value={MarketingID}
      placeholder="Enter Sender Name"
      disabled={false}
      onChange={(newValue) => setMarketingSenderName(newValue.replace(/(^\w+:|^)\/\//, '').replace("*",'').replace("*",'').replace("<",'').replace(">",''))}
      disabled={!btn}
      id="Marketing SMS"
    /></div>
    <br/>
    <TextField 
      name="username"
      label="User Name"
      value={username}
      placeholder="Enter Username"
      disabled={false}
      disabled={!btn}
      onChange={(newValue) => setUsername(newValue.replace(/(^\w+:|^)\/\//, '').replace("*",'').replace("<",'').replace(">",''))}
      id="username"
    />
    <br/>
     <TextField
      name="password"
      label="Password"
      value={password}
      placeholder="Enter Password"
      id="Password"
      disabled={!btn}
      onChange={(newValue) => setPassword(newValue.replace(/(^\w+:|^)\/\//, '').replace("*",'').replace("*",'').replace("<",'').replace(">",''))}
      type="password"
    /> 
    <br/>
<br/>
{error &&
  <InlineError message={message} fieldID="myFieldID" /> }
  <br/>
  {btn && <Button primary type="submit" onClick={onSubmitHandler}>Log In</Button> }
   {!btn && <Button destructive type="submit" onClick={LogOutHandler}>Log Out</Button>} 
    {/* <button type="submit">Submit</button> */}
    </section>
    </form>
    </div>
    {/* <CheckUserStatus/> */}
    </AppProvider>
    
  );
}      
  export default Index;