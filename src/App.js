import './App.css';
//import DateComponent from "./DateComponent"
import logo from "./sts-logo.png";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry';
import Demo from './Demo'



function App(){
  const [value, onChange] = useState([new Date(), new Date()]);
  //const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   fetch('/time').then(res => res.json()).then(data => {
  //     setCurrentTime(data.time);
  //   });
  // }, []);

   useEffect(() => {
     //const script1 = document.createElement('script');
     //script1.src = "https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.js";
     //script1.async = true;
     //document.body.appendChild(script1);

     const script2 = document.createElement('script');
     script2.src = "Dropper.js";
     //script2.async = true;
     document.body.appendChild(script2);
   return () => {
       //document.body.removeChild(script1);
       document.body.removeChild(script2);
     }
   }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" className="App-logo"/>
        <form action="http://localhost:5000/result" method="post" class="dropzone dz-clickable" id="dropper" enctype = "multipart/form-data">
          <label for="underlying">Underlying:</label><br />
          <input type="text" id="underlying" name="underlying" placeholder="Ex: a, AL"/><br /><br />
          <label for="expmonth">Expiration Month:</label><br />
          <input type="text" id="expmonth" name="expmonth" placeholder="Ex: 08, 11"/><br />
          <br />
          <div>
            <DateRangePicker
              onChange={onChange}
              value={value}
            />
          </div>
          <br />
          <div>
            <Demo />
          </div>
          <br />
          <input type="submit" className="submit-button" value="Submit"/>
        </form>
      </header>
    </div>
  );
}

export default App;
