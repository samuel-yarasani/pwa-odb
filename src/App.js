import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import odb from "./images/odb.png";
import { BsFillShareFill } from "react-icons/bs";
import { GrFormNext } from "react-icons/gr";
import { BsFillVolumeUpFill } from "react-icons/bs";
import Swal from "sweetalert2";

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
        json.data[0].verse = a;
        json.data[0].verse_url = b;
        json.data[0].verse_reference = c;
        setData(json.data[0]);
      })
      .catch((err) => {
        Swal.fire({
          title: "We Ran Into An Error",
          icon: "warning",
          dangerMode: true,
        });
        console.log(err);
      });
  }, []);

  const modle = Swal.mixin({
    customClass: {
      title: "m-title",

      confirmButton: "btn-m",
      cancelButton: "btn-m-c",
    },
    buttonsStyling: false,
    titleStyling: false,
  });

  return (
    <div>
      {!Data && (
        <div className="bg-cover loading">
          <img class="rotate" width="150" height="150" src={odb}></img>
        </div>
      )}
      {Data && (
        <div className="app">
          <div className="header">
            <h1 className="header-title">{"Today's Daily Bread"}</h1>
            <button className="header-share">
              <BsFillShareFill></BsFillShareFill>
            </button>
          </div>
          <div className="top">
            <div className="title">
              <h1 className="title-h1">{Data.title}</h1>
            </div>

            <div className="biy">
              <p className="biy-title">{"Bible in a year :"}</p>
              <a className="biy-a" href={Data.bible_in_a_year_url}>
                <p className="biy-p">{Data.bible_in_a_year_references}</p>
              </a>

              <svg
                class="biy-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentcolor"
                onClick={() =>
                  (window.location.href = Data.bible_in_a_year_url)
                }
              >
                <path d="M8 3L17 12L8 21" stroke-width="3" />
              </svg>
            </div>

            <div className="v">
              <p className="v-title">{"Verse of the day :"}</p>
              <p
                className="v-cp"
                dangerouslySetInnerHTML={{ __html: Data.verse }}
              ></p>
              <a className="v-a" href={Data.verse_url}>
                <p className="v-p">{Data.verse_reference}</p>
              </a>

              <svg
                class="v-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentcolor"
                onClick={() => (window.location.href = Data.verse_url)}
              >
                <path d="M8 3L17 12L8 21" stroke-width="3" />
              </svg>
            </div>

            <div className="btn-div">
              <button
                className="top-btn"
                onClick={() =>
                  modle
                    .fire({
                      title: '<h1 class="m-title">Today\'s insight</h1>',
                      html: Data.insights,
                      showCancelButton: true,
                      cancelButtonText: "Close",
                      confirmButtonText: Data.passage_reference,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        window.location.href = Data.passage_url;
                      }
                    })
                }
              >
                {"Today's insight : "}
                <div className="top-btn-w">{Data.passage_reference}</div>
              </button>
            </div>
          </div>
          <div className="ts">
            <div className="ts-header">
              <h1 className="ts-header-title">{"Today's Scripture:"}</h1>
              <button className="ts-header-icon">
                <BsFillVolumeUpFill></BsFillVolumeUpFill>
              </button>
            </div>
            <div className="ts-content">
              <p dangerouslySetInnerHTML={{ __html: Data.content }} />
            </div>
          </div>
          <div className="ts">
            <div className="ts-header">
              <h1 className="ts-header-title">{"Reflect & Pray"}</h1>
            </div>
            <div className="ts-content">
              <em>
                <p dangerouslySetInnerHTML={{ __html: Data.response }} />
              </em>
              <p dangerouslySetInnerHTML={{ __html: Data.thought }} />
            </div>
          </div>
          <div className="pic">
            <div className="ts-header">
              <h1 className="ts-header-title">{"Today's Picture"}</h1>
            </div>
            <img className="pic-img" src={Data.shareable_image}></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
