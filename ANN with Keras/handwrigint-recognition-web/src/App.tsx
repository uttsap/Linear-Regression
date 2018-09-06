import * as React from "react";
import "./App.css";

// import * as Webcam from 'react-webcam';

import axios from "axios";
import react from "./logo.svg";

// import { Navbar } from "./components";
import { BASE_URL } from "./constants";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      file: "",
      label: "Choose a file",
      prediction: "React Js logo",
      probability: 1,
      showPrediction: false,
      uploaded: false,
      url: react
    };
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    axios.get(BASE_URL + "predict").then(response =>
      this.setState({
        prediction: response.data.prediction,
        probability: response.data.probability,
        showPrediction: true,
        uploaded: false
      })
    );
  };

  handleChange = (e: any) => {
    if(e.target.files[0]){
      this.setState(
        {
          file: e.target.files[0],
          label: e.target.files[0].name,
          uploaded: false,
          url: URL.createObjectURL(e.target.files[0])
        },
        () => {
          const formData = new FormData();
          formData.append("image", this.state.file);
          axios.post(BASE_URL + "upload", formData).then(response => {
            if (response) {
              this.setState({
                showPrediction: false,
                uploaded: true
              });
            }
          });
        }
      );
    }
  };

  getButton = () => {
    if (this.state.uploaded) {
      return (
        <button type="submit" className="btn btn-custom">
          Predict!
        </button>
      );
    } else {
      return (
        <button type="submit" className="btn btn-custom" disabled={true}>
          Predict!
        </button>
      );
    }
  };

  render() {
    return (
      <div className="App">
        {/* <Navbar /> */}
        <div className="container-fluid custom-container">
          <div className="contaner custom-form">
            <img src={this.state.url} className="img-thumbnail" />
            {this.state.showPrediction ? (
              <p>
                I am{" "}
                <strong>{Math.round(this.state.probability * 100)}%</strong>{" "}
                sure that, it's <strong> {this.state.prediction}</strong>
              </p>
            ) : null}
            <form onSubmit={this.handleSubmit} className="custom">
              <div className="form-group">
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="inputfile"
                  onChange={this.handleChange}
                />
                <label htmlFor="file" className="btn btn-light">
                  {this.state.label}
                </label>
              </div>
              {/* <Webcam/> */}
              {this.getButton()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
