import React, { useState } from "react";
// import "../../login.css";
import img from "../../assets/logo1.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

export default function LoginForm() {
  const [inputs, setInputs] = useState({});
  const [loader, setLoader] = useState();
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    axios
      .post("https://fire-hot-hardhat.glitch.me/login", inputs)
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        if (inputs.username == "admin") {
          sessionStorage.setItem("user", "VIEW BY ALL");
        } else {
          sessionStorage.setItem("user", inputs.username);
        }
        navigate("/home");
        setLoader(false);
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
        setLoader(false);
      });
  };
  return (
    <>
      <div class="video-login">
        <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" />
      </div>
      <div class="hello">
        <form
          onSubmit={handleSubmit}
          style={{ margin: "0px" }}
          className="login-form"
        >
          <div
            class="form_contain1"
            style={{ display: "flex", backgroundColor: "transparent" }}
          >
            <img src={img} alt="apml" />
            <br />
            <br />
            <div class="vl"></div>+
            <div class="login_contain">
              <div
                class="form-outline mb-4"
                style={{
                  display: "flex",
                  alignContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label class="form-label" for="form2Example1">
                  Username
                </label>
                <input
                  type="text"
                  id="form2Example1"
                  class="form-input"
                  name="username"
                  placeholder=" Username"
                  onChange={handleChanges}
                />
              </div>
              <br /> <br />
              <div
                class="form-outline mb-4"
                style={{
                  display: "flex",
                  alignContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label class="form-label" for="form2Example2">
                  Password
                </label>
                <input
                  type="password"
                  id="form2Example2"
                  class="form-input"
                  name="password"
                  placeholder=" Password"
                  onChange={handleChanges}
                />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  jusityContent: "center",
                  marginTop: "1.7rem",
                }}
              >
                <button
                  type="submit"
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                    backgroundColor: loader ? "transparent" : "black",
                  }}
                  class="btn btn-primary btn-block mb-4"
                >
                  {loader ? (
                    <PropagateLoader color={"rgb(3, 204, 255,1)"} size={10} />
                  ) : (
                    <>Sign in</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}