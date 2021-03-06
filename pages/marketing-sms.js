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
    Toast,
    Subheading,
    List

  } from '@shopify/polaris';
  import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
  import enTranslations from '@shopify/polaris/locales/en.json';

  var result
  var numbers=[]
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
    const [loginErr,setLoginErr]=useState(false)
    const [active, setActive] = useState(false);
    const [DummyUrl,setDummyUrl]=useState()
    const [ToastContent,setToastContent]=useState("")
    const [fileName,setFilename] =useState("Not Uploaded")
    
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    //End State Configuration
   
    const toastMarkup = active ? (
      <Toast content={ToastContent} onDismiss={toggleActive} />
    ) : null;


    //Functions

    function onSendHandler(){
        // console.log(numbers)
      if(message===""){
        setErr(true)
        setSendErr(true)
          setErrMessage("Message Boday Cannot Be Empty")
      }
      else if(numbers.length===0){
        // console.log(numbers.length)
        setErr(false)
        setSendErr(true)
          setErrMessage("Please import customer CSV to send message")
      }
      else{
        setErr(false)
        setSendErr(false)
        // console.log(numbers)
        const FORMATTED_ARRAY=JSON.stringify(numbers)
        const SERIALIZED=encodeURIComponent(FORMATTED_ARRAY)
        fetch("https://precise-communications-api.herokuapp.com/api/bulkmessage/"+SERIALIZED+"/"+message+"/"+SenderName)
        .then(response=>response.json())
        .then(json=>{
          // console.log(json)
         if(json.status==="OK"){
           setToastContent("Message Sent")
           numbers=[]
           result=""
           setActive(true)
         }
         else{
          setToastContent("Failed to send message")
          setActive(true)
         }
        })
      }
    }
    function setArray(){
      result.data.map(Phone=>
        {
          console.log()
          if(Phone.Phone !== undefined || Phone.Phone !== null || Phone.Phone !== ""){
         numbers.push(Phone.Phone)
          }
        }
        )
   numbers.pop(undefined)
   console.log()

    }
    
    useEffect(async function(){
      var SHOP_URL
      setErr(false)
      setSendErr(false)
      console.log()
      console.log()
      console.log()
      if(document.location.ancestorOrigins.item(0)===null){
        console.log("Stored Host Name "+ document.location.host)
        setDummyUrl(document.location.host);
        SHOP_URL=(document.location.host).replace("https://","").replace("http://","")
        
       }
       else{
         console.log()
         setDummyUrl((document.location.ancestorOrigins.item(0)).replace("https://","").replace("http://",""));
         SHOP_URL = (document.location.ancestorOrigins.item(0)).replace("https://","").replace("http://","")
       }
       //
       console.log()
       var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      console.log()
      fetch("https://precise-communications-api.herokuapp.com/api/select/"+SHOP_URL, requestOptions)
      .then(response => response.json())
      .then(result =>{
          // console.log(result)
          if (result.status==="500" || result.response.status==="logged_out"){
            setLoginErr(true)

          }
          else{
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
            SHOP_URL=SHOP_URL.replace(".myshopify.com","")
            console.log()
            setSenderName(result.response.marktingID)
            fetch("https://precise-communications-api.herokuapp.com/api/select_marketing/"+SHOP_URL,requestOptions)
            .then(response=>response.json())
            .then(json=>{
              // console.log(json.details)
              console.log()
              if (json.details !== null || json.details !==undefined){
                console.log()
              setMessage(json.details.marketing_sms)
              }
              else{
                setMessage("Marketing SMS")
              }
              // console.log(json)
            })
            .catch(err=>console.log(err))
          }
      }).catch(error => console.log('error', error));
    },[])
    function onSaveHandler(){
      var SHOP_URL = DummyUrl.replace(/(^\w+:|^)\/\//, '').replace(".myshopify.com","");
      console.log(SHOP_URL)
      if(message!==""){
        var config = {
          method: 'get',
          url: 'https://precise-communications-api.herokuapp.com/api/marketingsms/'+SHOP_URL+'/'+message,
          headers: {}
        };
        
        axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          setActive(true)
          setToastContent("Updated Marketing Message")
        })
        .catch(function (error) {
          console.log(error);
        });
        
      }
    }

    // @desc Delete CSV file from DROP BOX
    function deleteHandler(){
      result=""
      numbers=[]
      setFilename("Not Uploaded")
    }
    // End Of Functions

      return (
        <AppProvider i18n={enTranslations}>
          <div className="card-1 left">
          <div className="warpper">
        <Frame>
        <ResourcePicker
          resourceType="Customer"
          showVariants={false}
          open={true}
          onSelection={(resources) => ResSelection(resources)}
          onCancel={() => setResSelection(false)}
        />
        {loginErr && <InlineError message="You might have not logged in. Please try again" fieldID="myFieldID" /> }
        <div className="sender-field">
            <TextField label="Sender Name" value={SenderName} onChange={(newValue) => setSenderName(newValue)} disabled/>
        </div>
        <br/>
        <div className="sms-template">
        <Checkbox label="Marketing SMS Template" checked={checked} disabled={loginErr} onChange={(newvalue)=>setChecked(!checked)}/>
        <TextField value={message} onChange={(newValue) => setMessage(newValue)} disabled={loginErr} />
        {err &&
            <InlineError message={errMessage} fieldID="myFieldID"/> }
        <br/>
        <Button primary disabled={loginErr} onClick={onSaveHandler}>Save</Button>
        </div>
        <br/>
        <div>
          <div 
          className="drop-zone"
          onDragOver={(e)=>{ e.preventDefault();}}
          onDrop={(e)=>{
            e.preventDefault();
             setPhone([])
            // console.log(e.dataTransfer.files)
            setActive(true)
            numbers=[]
           
            Array.from(e.dataTransfer.files)
            .filter(file=>file.type==="text/csv" || file.type==="application/vnd.ms-excel")
              .forEach(async (file)=>{
                setFilename(file.name)
                const text=await file.text();
                result = parse(text, {header:true})
                console.log()
                setToastContent("File Uploaded")
                console.log()
            setPhone(existing=>[...existing,...result.data])
                console.log()
                setArray()
              });
          }}
          >
          <Icon source={CirclePlusMinor} />Drag and Drop CSV file here
    </div>  
    { fileName==="Not Uploaded" && <h2 style={{color:"red"}}>File Name : <strong>{fileName}</strong></h2> }
    { fileName!=="Not Uploaded" && <h2 style={{color:"Green"}}>File Name : <strong>{fileName}</strong> <Link onClick={deleteHandler} external> DELETE</Link></h2> }
 </div>
 <br/>
 {sendErr && <InlineError message={errMessage} fieldID="myFieldID"/> }
        <div  className="button"><Button primary onClick={onSendHandler} disabled={loginErr}>Send SMS</Button></div><Button destructive>Cancel</Button>
        {toastMarkup}
        </Frame>
        </div>
        </div>
                <div className="card-1 right">
                <Card title="CSV FILE IMPORT INSTRUCTIONS">  
                <br/>
                <div className="Wrapper-Content">
               
                <List type="number">
                <List.Item>Click on <strong><u>Customers</u></strong> in the left side of <strong><u></u>Shopify Admin</strong> admin panel </List.Item>
                <List.Item>Select customers whome you want to send SMS using checkbox</List.Item>
                <List.Item>Click on <strong><u>Export Button</u></strong> on top right corner</List.Item>
                <List.Item>You will find <strong><u>Export Customers</u></strong> pop-up<br/></List.Item>
                </List>
                <List type="number">
                <br/>
              <strong><u>Selecting Customers</u></strong>
              <br/>
                <br/>
                    <List.Item>Under <strong><u>Export</u></strong> select appropriate option</List.Item>
                    <List.Item>Plese Note: if you select <strong><u>All Customers</u></strong>, CSV file will be sent to your registerd E-mail ID</List.Item>
                  <br/>
                  <strong><u>Selecting Export Format</u></strong>
                  <br/>
                  <br/>
                  <List.Item>Under <strong><u>Export As</u></strong>. Choose <strong><u>CSV for Excel, Numbers, or other spreadsheet programs</u></strong></List.Item>
                  <List.Item>Click on <strong><u>Export Customers</u></strong> button on bottom right</List.Item>
                  <List.Item>Now you can Drag And Drop that file in <strong><u>SMS Marketing </u></strong>Tab of <strong>Precise Communications SMS</strong></List.Item>
          </List>
                </div>
              </Card>
              </div>
        </AppProvider>
      );
  }
  
  
  export default AnnotatedLayout;