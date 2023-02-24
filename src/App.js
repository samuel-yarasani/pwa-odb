import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import odb from "./images/odb.png";
import { BsFillShareFill } from "react-icons/bs";
import { AiFillPauseCircle } from "react-icons/ai";
import { BsFillVolumeUpFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { RWebShare } from "react-web-share";

function App() {
  const [Data, setData] = useState(null);
  const [s, sets] = useState(true);
  const [audio, setaudio] = useState(null);

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
        const verse = json.data[0].verse;
        const verseStart = verse.indexOf('>') + 1;
        const verseEnd = verse.indexOf('"', verseStart);
        const verseText = verse.substring(verseStart, verseEnd);

        const verseUrlStart = verseEnd + 2;
        const verseUrlEnd = verse.indexOf('"', verseUrlStart);
        const verseUrl = verse.substring(verseUrlStart, verseUrlEnd);

        const referenceStart = verse.indexOf('>', verseUrlEnd) + 1;
        const referenceEnd = verse.indexOf('<', referenceStart);
        const referenceText = verse.substring(referenceStart, referenceEnd);

        const responseText = json.data[0].response.replace(/(<([^>]+)>)/gi, "");

        setData({
          ...json.data[0],
          verse: verseText,
          verse_url: verseUrl,
          verse_reference: referenceText,
          r: responseText
        });

        setaudio(new Audio(json.data[0].audio_url));
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

  function play() {
    audio.play();
    sets(false);
  }

  function pause() {
    audio.pause();
    sets(true);
  }


  return (
    <div className={"container"}>
      {!Data && (
        <div className="bg-cover loading">
          <img className="rotate" width="150" height="150" src={odb} alt="Logo"></img>
        </div>
      )}
      {Data && (
        <div className="app">
          <div className="header">
            <h1 className="header-title">{"Today's Daily Bread"}</h1>
            <RWebShare
              data={{
                text:
                  "Click here to see Today's Daily Bread,Today's Insight,Bible In-One-Year and Today's Verse \n",
                title: "Our Daily Bread",
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <button className="header-share">
                <BsFillShareFill></BsFillShareFill>
              </button>
            </RWebShare>
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
                className="biy-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentcolor"
                onClick={() =>
                  (window.location.href = Data.bible_in_a_year_url)
                }
              >
                <path d="M8 3L17 12L8 21" strokeWidth="3" />
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
                className="v-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentcolor"
                onClick={() => (window.location.href = Data.verse_url)}
              >
                <path d="M8 3L17 12L8 21" strokeWidth="3" />
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
              {s && (
                <button className="ts-header-icon" onClick={() => play()}>
                  <BsFillVolumeUpFill></BsFillVolumeUpFill>
                </button>
              )}
              {!s && (
                <button className="ts-header-icon" onClick={() => pause()}>
                  <AiFillPauseCircle></AiFillPauseCircle>
                </button>
              )}
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
            <img className="pic-img" src={Data.shareable_image} alt="Today's"></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
