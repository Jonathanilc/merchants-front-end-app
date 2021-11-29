import "./App.css";
import { useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import { FileUploader } from "react-drag-drop-files";

import Icon from "./components/icon";

function App() {
  const [industry, setIndustry] = useState("");
  const [transactionCount, setTransactionCount] = useState("");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [result, setResult] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [err, setErr] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [getKey, setGetKey] = useState("");
  const [uploadKey, setUploadKey] = useState("");

  const fileTypes = ["CSV"];
  const handleChange = (file) => {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": uploadKey,
      },
    };
    const data = new FormData();
    data.append("file", file);
    try {
      axios
        .post(`${process.env.REACT_APP_UPLOAD_API_ENDPOINT}`, data, config)
        .then(function (response) {
          setResult(response);
          if (response && response.data) {
            setTotalCost(response.data.totalCost);
            setErr("");
          }
        })
        .catch(function (error) {
          if(error.response) {
            setErr(error.response.data.error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": getKey,
        "Access-Control-Allow-Origin": "*",
      },
    };
    const data = {
      Industry: industry,
      TransactionCount: transactionCount,
      TransactionVolume: transactionVolume,
    };
    try {
      axios
        .post(`${process.env.REACT_APP_GETCOST_API_ENDPOINT}`, data, config)
        .then(function (response) {
          setResult(response);
          if (response && response.data) {
            setTotalCost(response.data.totalCost);
            setErr("");
          }
        })
        .catch(function (error) {
          if(error.response) {
            setErr(error.response.data.error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderJsonViewer = () => {
    if (result) {
      return (
        <div style={{ textAlign: "left" }}>
          <ReactJson src={result} theme="monokai" />;
        </div>
      );
    }
    return null;
  };

  const renderDropZone = () => {
    if (showUpload) {
      return (
        <div>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <label>
            GET COST API KEY:
            <input
              value={getKey}
              onChange={(e) => setGetKey(e.target.value)}
              type="text"
              name="getKey"
            />
          </label>
          <label>
            UPLOAD API KEY:
            <input
              value={uploadKey}
              onChange={(e) => setUploadKey(e.target.value)}
              type="text"
              name="uploadKey"
            />
          </label>
        </form>
        <div>Merchants Cost Estimator</div>
        <form>
          <label>
            Industry:
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              type="text"
              name="industry"
            />
          </label>
          <label>
            TransactionCount:
            <input
              value={transactionCount}
              onChange={(e) => setTransactionCount(e.target.value)}
              type="text"
              name="transactionCount"
            />
          </label>
          <label>
            TransactionVolume:
            <input
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
              type="text"
              name="transactionVolume"
            />
          </label>
          <input onClick={onSubmit} type="button" value="Submit" />
          {totalCost && !err && <div>Total Cost: {totalCost}</div>}
          {err && <div>{err}</div>}
        </form>
        <div onClick={() => setShowUpload(!showUpload)}>
          <Icon />
        </div>
        {renderDropZone()}
      </header>

      {renderJsonViewer()}
    </div>
  );
}

export default App;
