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
class Index extends React.Component {
 constructor(props) {
   super(props)

   this.state = {
      username:"",
      password:"",
      credits:"0",
      Credentials:"False",
      error:true
   }
 }
  OnchangeHandler=e=>{
        this.state.value
    }
  onSubmitHandler=e=>{
    e.preventDefault()
    if((this.state.username==="" && this.state.password==="")||(this.state.username==="")||(this.state.password==="")){
      // Show Error
      alert("Hello")
    }
    else{
   fetch("https://precise-comm-sms.ishanjirety.repl.co/api/credits/"+this.state.username+"/"+this.state.password)
            .then(response=>response.json())
            .then(json=>{
                        if(json.status==="OK"){
                        this.setState({credits:json.data.balance});
                        this.state.Credentials="True";
                        console.log(window.location.ancestorOrigins.item(0)); // To get Current Url Of SHOP
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
                        this.CreateUser()                    
                        }
                        else{
                          this.state.Credentials="False";
                           this.state.error="true"
                        }
                        })
                      }
  }
  // Creating User Table Entry
  CreateUser(){
    const DUMMY_URL=window.location.ancestorOrigins.item(0);
    var SHOP_URL = DUMMY_URL.replace(/(^\w+:|^)\/\//, '');
    console.log(JSON.stringify(SHOP_URL))
    const USERNAME=this.state.username;
    const PASSWORD=this.state.password;
    const SHOP_NAME="DUMMY";
    const STATUS=true;
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/insert/"+USERNAME+"/"+PASSWORD+"/"+SHOP_NAME+"/"+JSON.stringify(SHOP_URL)+"/"+STATUS
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(URL, requestOptions)
      .then(response => response.text())
      .then(result => this.CreateTable())
      .catch(error => console.log('error', error));
  }
  // Creating Table If user Authenticated
  CreateTable(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const URL= "https://Precise-Comm-SMS.ishanjirety.repl.co/api/create/"+this.state.username;
    fetch(URL, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
    render() { 
    return (
      <AppProvider i18n={enTranslations}>
    <div>
     <Card title="Available Credits" sectioned>
  <h3>{this.state.credits}</h3>
    </Card>
    <br/>
    <form onSubmit={this.onSubmitHandler}>
    <section className="form-class">
      
    <TextField 
      name="username"
      label="User Name"
      value={this.state.username}
      placeholder="Enter Username"
      disabled={false}
      onChange={(newValue) => this.setState({username: newValue})}
      id="username"
    />
    <br/>
     <TextField
     onChange={this.ChangeHandler}
      name="password"
      label="password"
      value={this.state.password}
      placeholder="Enter Password"
      id="password"
      onChange={(newValue) => this.setState({password: newValue})}
    /> 
    <br/>
<br/>
{ this.state.error &&
  <InlineError message="Store name is required" fieldID="myFieldID" /> }
  
    <Button primary type="submit" onClick={this.onSubmitHandler}>Log In</Button>
    {/* <button type="submit">Submit</button> */}
    </section>
    </form>
    </div>
    </AppProvider>
  );
      }    
    }
  
  export default Index;