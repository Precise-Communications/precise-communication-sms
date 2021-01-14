import React,{useEffect,useCallback, useState} from "react"
import "./styles.css"
import axios from 'axios'
import form_data from 'form-data'
import {parse} from 'papaparse';
import {CirclePlusMinor} from '@shopify/polaris-icons';
import {
    Button,
    Card,
    Form,
    FormLayout,
    Layout,
    SettingToggle,
    Page,
    Frame,
    TextField,
    DataTable,
    TextStyle,
    Checkbox,
    AppProvider,
    InlineError,
    Link,
    Icon,
    Toast

  } from '@shopify/polaris';
  import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
  import enTranslations from '@shopify/polaris/locales/en.json';


  function AnnotatedLayout()  {

    // State Configuration
    const [SenderName, setSenderName] = useState('');
    const [checked, setChecked] = useState(true);
    const [ResSelection,setResSelection]=useState();
    const [message,setMessage]=useState("");
    const [errMessage,setErrMessage]=useState("");
    const [err,setErr]=useState(false)
    const [sendErr,setSendErr]=useState(false)
    const [highlighted,setHighlighted]=useState(false)
    const [Phone,setPhone]=useState([]);
    var numbers=[]
    const [active, setActive] = useState(false);
    const [DummyUrl,setDummyUrl]=useState("")
    
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    //End State Configuration
   
    const toastMarkup = active ? (
      <Toast content="File Uploaded" onDismiss={toggleActive} />
    ) : null;


    //Functions

    function onSendHandler(){
      if(message===""){
        setErr(true)
        setSendErr(true)
          setErrMessage("Message Boday Cannot Be Empty")
      }
      else if(numbers.length===0){
        setErr(false)
        setSendErr(true)
          setErrMessage("Please import customer CSV to send message")
      }
      else{
        setErr(false)
      }
    }
    function setArray(){
      Phone.map(Phone=>numbers.push(Phone.Phone))
      console.log(numbers.length)
    }
    
    useEffect(async function(){
      if(document.location.ancestorOrigins.item(0)==="null"){
        setDummyUrl(document.location.host);
       }
       else{
         setDummyUrl(document.location.ancestorOrigins.item(0));
       }
       //
       var SHOP_URL = DummyUrl.replace(/(^\w+:|^)\/\//, '');
       var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch("https://precise-comm-sms.ishanjirety.repl.co/api/select/"+SHOP_URL, requestOptions)
      .then(response => response.json())
      .then(result =>{
          // console.log(result)
          if (result.status==="500" || result.response.status==="logged_out"){
            alert("Not Logged In")
          }
          else{
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
            SHOP_URL=SHOP_URL.replace(".myshopify.com","")
            console.log(SHOP_URL)
            setSenderName(result.response.MarketingID)
            fetch("https://Precise-Comm-SMS.ishanjirety.repl.co/api/select_marketing/"+SHOP_URL,requestOptions)
            .then(response=>response.json())
            .then(json=>{
              setMessage(json.details.marketing_sms)
              // console.log(json)
            })
            .catch(console.log(err))
          }
      }).catch(error => console.log('error', error));
    })
    // End Of Functions

      return (
        <AppProvider i18n={enTranslations}>
        <Page className="PageClass">
        <Frame>
        <ResourcePicker
          resourceType="Customer"
          showVariants={false}
          open={true}
          onSelection={(resources) => ResSelection(resources)}
          onCancel={() => setResSelection(false)}
        />
        <div className="sender-field">
            <TextField label="Sender Name" value={SenderName} onChange={(newValue) => setSenderName(newValue)} disabled/>
        </div>
        <br/>
        <div className="sms-template">
        <Checkbox label="Marketing SMS Template" checked={checked}  onChange={(newvalue)=>setChecked(!checked)}/>
        <TextField value={message} onChange={(newValue) => setMessage(newValue)} />
        {err &&
            <InlineError message={errMessage} fieldID="myFieldID"/> }
        <br/>
        <Button primary>Save</Button>
        </div>
        <br/>
        <div>
          <div 
          className="drop-zone"
          onDragOver={(e)=>{ e.preventDefault();}}
          onDrop={(e)=>{
            e.preventDefault();
            setPhone([])
            console.log(e.dataTransfer.files)
            setActive(true)
            Array.from(e.dataTransfer.files)
            .filter(file=>file.type==="text/csv" || file.type==="application/vnd.ms-excel")
              .forEach(async (file)=>{
                const text=await file.text();
                const result = parse(text, {header:true})
                setPhone(existing=>[...existing,...result.data])
                setArray()
              });
          }}
          >
          <Icon source={CirclePlusMinor} />Drop File Here
    </div>         
 </div>
 <br/>
 {sendErr && <InlineError message={errMessage} fieldID="myFieldID"/> }
        <div  className="button"><Button primary onClick={onSendHandler}>Send</Button></div><Button destructive>Cancel</Button>
        {toastMarkup}
        </Frame>
        </Page>
        </AppProvider>
      );
  }
  
  
  export default AnnotatedLayout;