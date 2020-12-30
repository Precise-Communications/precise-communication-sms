import React,{useState} from "react"
import {AppProvider,TextField,Button,InlineError,Banner,Card,FormLayout,Heading,Badge,Stack,EmptyState, Layout, Page} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import "./styles.css"
import axios from 'axios'
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

                      
                        }
                        else{
                          this.state.Credentials="False";
                           this.state.error="true"
                        }
                        })
                      }
  }
  // inError=()=>{
  //   return <InlineError message="Store name is required" fieldID="myFieldID" />
  // }
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