import React,{useState} from "react"
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

  function OnchangeHandler(){
        this.state.value
    }
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [credits,setCredits]=useState("")
  const [error,setError]=useState(false)
  const [credentials,setCredentials]=useState("")
  const [message,setMessage]=useState("Incorrect username/password")
  const [btn,setBtn]=useState(true)

  // Creating User Table Entry
  function CreateUser(){
    const DUMMY_URL=window.location.ancestorOrigins.item(0);
    var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
    console.log(JSON.stringify(SHOP_URL))
    const USERNAME=username;
    const PASSWORD=password;
    const SHOP_NAME="DUMMY";
    const STATUS=true;
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/insert/"+USERNAME+"/"+PASSWORD+"/"+SHOP_NAME+"/"+JSON.stringify(SHOP_URL)+"/"+STATUS
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(URL, requestOptions)
      .then(response => response.text())
      .then(result => CreateTable())
      .catch(error => console.log('error', error));
  }
  // Creating Table If user Authenticated
  function CreateTable(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/create/"+username;
    fetch(URL, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
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
/**
 * Check If User Is loggedIn
 */


function CheckUserStatus(){
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
  
  var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
  fetch("https://precise-comm-sms.ishanjirety.repl.co/api/select/"+SHOP_URL, requestOptions)
    .then(response => response.json())
    .then(result =>{
        console.log(result.response)
        if (result.response==="null"){
          setBtn(true)
        }
        else{
          setBtn(false)
        }
    }).catch(error => console.log('error', error));
    return <div></div>
}

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
      
    <TextField 
      name="username"
      label="User Name"
      value={username}
      placeholder="Enter Username"
      disabled={false}
      onChange={(newValue) => setUsername(newValue)}
      id="username"
    />
    <br/>
     <TextField
      name="password"
      label="password"
      value={password}
      placeholder="Enter Password"
      id="password"
      onChange={(newValue) => setPassword(newValue)}
    /> 
    <br/>
<br/>
{error &&
  <InlineError message={message} fieldID="myFieldID" /> }
  <br/>
  {!btn && <Button primary type="submit" onClick={onSubmitHandler}>Log In</Button> }
   {btn && <Button destructive type="submit" onClick={onSubmitHandler}>Log Out</Button>} 
    {/* <button type="submit">Submit</button> */}
    </section>
    </form>
    </div>
    <CheckUserStatus/>
    </AppProvider>
    
  );
}      
  export default Index;