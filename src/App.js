import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import odb from "./images/odb.png";
function App() {
  const [Data, setData] = useState(null);
  useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    axios
      .get(
        `https://api.experience.odb.org/devotionals/v2?on=${mm}-${dd}-${yyyy}`
      )
      .then((json) => {
        var index = json.data[0].verse.indexOf("<a");
        var a, b, c, d, ai, ci, bi;
        a = json.data[0].verse.substr(0, index);
        ai = a.indexOf(">");
        a = a.substr(ai + 1);
        b = json.data[0].verse.substr(index + 1);
        bi = b.indexOf('"');
        b = b.substr(bi + 1);
        bi = b.indexOf('"');
        c = b.substr(bi + 1);
        b = b.substr(0, bi);
        ci = c.indexOf(">");
        c = c.substr(ci + 1);
        ci = c.indexOf("<");
        c = c.substr(0, ci);
        c = "-" + c;
        json.data[0].verse = a;
        json.data[0].verse_url = b;
        json.data[0].verse_reference = c;
        setData(json.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {!Data && (
        <div className="bg-cover loading">
          <img class="rotate" width="150" height="150" src={odb}></img>
        </div>
      )}
      {Data && (
        <div className="bg-cover">
          <div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
