import React from "react"
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
    Checkbox
  } from '@shopify/polaris';
  
  class AnnotatedLayout extends React.Component {
    render() {  
      return (
        
        <Page className="PageClass">
          <Checkbox label="New Customer Signup"checked="true"/><TextField placeholder="Enter Message"/> <br/>
          <Checkbox label="When Order Is Placed" checked="true" /> <TextField placeholder="Enter Message"/><br/> 
          <Checkbox label="When Order Is Fulfilled" checked="true"/><TextField placeholder="Enter Message"/><br/> 
          <Checkbox label="When Order Is Canceled" checked="true"/> <TextField  placeholder="Enter Message"/><br/>
          <Checkbox label="SMS for abandoned carts" checked="true"/>  <TextField  placeholder="Enter Message"/><br/>
          <Checkbox label="Shipping Notifications" checked="true"/><TextField  placeholder="Enter Message"/><br/> 
          <Checkbox label="Marketing SMS" checked="true"/><TextField  placeholder="Enter Message"/>
        </Page>
      );
    }
  
    handleSubmit = () => {
      this.setState({
        discount: this.state.discount,
      });
      
      console.log('submission', this.state);
    };
  
    handleChange = (field) => {
      return (value) => this.setState({ [field]: value });
    };
    handleToggle = () => {
        this.setState(({ enabled }) => {
          return { enabled: !enabled };
        });
      };    
  }
  
  
  export default AnnotatedLayout;