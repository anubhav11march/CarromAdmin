import React from "react";
import { Alert, Container, Form, Spinner } from "react-bootstrap";
import { MdAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import { RiLockPasswordFill } from "react-icons/ri";
import OtpInput from "react-otp-input";
import validator from "validator";
import "./style.css";
import Cookies from "js-cookie";
import axios from "axios";

const ForgetPasswordScreen = () => {
  const token = Cookies.get("token");
  let navigate = useNavigate();

  const [state, setState] = React.useState("forgetPassword");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [cPass, setCPass] = React.useState("");
  const [succ, setSucc] = React.useState("");

  function sendOtp(e) {
    e.preventDefault();
    setLoading(true);
    // console.log('In Send OTP function');
    // console.log(email) ;
    if (validator.isEmail(email)) {
      // console.log('Email validated');
      axios
        .post(
          "https://carom0.herokuapp.com/admin/forgotpassword",
          {
            email: email,
          },
          { Authorization: `Bearer ${token}` }
        )
        .then((res) => {
          // console.log(res);
          setLoading(false);
          setState("enterOtp");
        })
        .catch((error) => {
          // console.log(error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("Enter Valid Email!");
      setLoading(false);
    }
  }

  function clearOtp(e) {
    e.preventDefault();
    setOtp("");
  }

  function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    // console.log(otp);

    if (otp.length < 4) {
      setError("Invalid OTP!");
      setOtp("");
      setLoading(false);
      return;
    }

    const config = {
      email: email,
      code: parseInt(otp),
    };

    axios
      .post("https://carom0.herokuapp.com/admin/verifycode", config, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        setLoading(false);
        setState("resetPassword");
        setError("");
        // console.log(res) ;
      })
      .catch((error) => {
        // console.log(error);
        setError(error.message);
        setLoading(false);
      });

    // setState('resetPassword');
  }

  function resetPassword(e) {
    e.preventDefault();
    setLoading(true);

    if (pass === "" || cPass === "") {
      setError("Password's can't be empty!");
      setLoading(false);
      return;
    } else if (pass !== cPass) {
      setError("Password's should be same!");
      setLoading(false);
      return;
    }
    const config = {
      email: email,
      password: pass,
    };
    axios
      .post("https://carom0.herokuapp.com/admin/resetpassword", config, {
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        // console.log(res);
        setSucc("Your Password Changed Successfully..");
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        // console.log(error);
        setError(error.response.data.error);
        setLoading(false);
      });
  }

  return (
    <>
      <nav className="navbar" style={{ background: "rgb(255, 153, 51)" }}>
        <div className="container-fluid">
          <p className="navbar-brand my-0" style={{ color: "white" }}>
            Admin Login Page
          </p>
        </div>
      </nav>
      {loading ? (
        <div className="w-100 my-5 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        ""
      )}
      {error !== "" ? (
        <div className="w-100 mt-5 d-flex justify-content-center align-items-center">
          <Alert
            className="w-25 sm-w-75 mb-5 d-flex justify-content-between"
            variant="danger"
          >
            {error}
            <span style={{ cursor: "pointer" }} onClick={() => setError("")}>
              X
            </span>
          </Alert>
        </div>
      ) : (
        ""
      )}
      {state === "forgetPassword" ? (
        <Container className="forget-password">
          <h2 className="text-center">Forget Password ?</h2>

          <div className="text mt-3">
            Don't worry it happens. Please enter the address assosiated to your
            account .
          </div>

          <Form className="form-container">
            <Form.Group className="mb-3 form-feild" controlId="formBasicEmail">
              <MdAlternateEmail size={30} color="#949494" />
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </Form.Group>

            <button className="sendOtp-btn" onClick={sendOtp}>
              Submit
            </button>
          </Form>
        </Container>
      ) : state === "enterOtp" ? (
        <Container className="enterotp-screen">
          <h3 className="">Enter OTP</h3>

          <p className="text-center text">A 4 digit OTP has been sent to</p>
          <p>{email}</p>

          <OtpInput
            value={otp}
            onChange={(otp) => setOtp(otp)}
            numInputs={4}
            isInputNum={true}
            separator={<span>-</span>}
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "20px 1rem",
              fontSize: "2rem",
              borderRadius: 4,
              border: "2px solid rgba(0,0,0,0.3)",
            }}
          />

          <button className="verOtp-btn" onClick={verifyOtp}>
            Verify OTP
          </button>
          <button className="clOtp-btn" onClick={clearOtp}>
            Clear OTP
          </button>
        </Container>
      ) : state === "resetPassword" ? (
        <Container className="reset-password">
          {succ && (
            <div className="w-100 my-5 d-flex justify-content-center align-items-center">
              <Alert variant="success">{succ}</Alert>{" "}
            </div>
          )}
          <h2 className="mb-4">Reset Password</h2>

          <Form className="form-container">
            <Form.Group
              className="mb-3 form-feild"
              controlId="formBasicPassword"
            >
              <RiLockPasswordFill size={30} color="#949494" />
              <Form.Control
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group
              className="mb-3 form-feild"
              controlId="formBasicPassword"
            >
              <RiLockPasswordFill size={30} color="#949494" />
              <Form.Control
                value={cPass}
                onChange={(e) => setCPass(e.target.value)}
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Group>
          </Form>

          <button className="resPass-btn" onClick={resetPassword}>
            Submit
          </button>
        </Container>
      ) : (
        ""
      )}
    </>
  );
};

export default ForgetPasswordScreen;
