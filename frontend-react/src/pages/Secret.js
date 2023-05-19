import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// backend api endpoint for register..
const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const SecretPanel = () => {
  const navigate = useNavigate();
  const [secretMessage, setSecretMessage] = useState(null);

  useEffect(() => {
    // api v1/secret
    const getSecret = async () => {
      // attach auth info
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await axios.get(`${BACKEND_API}/secret`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (data.status) {
          setSecretMessage(data.msg);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        navigate('/')
      }
    }
    getSecret();
  }, [])

  const signoutHandler = () => {
    localStorage.removeItem('accessToken');
    navigate('/')
  }

  return (
    <>
      <div className="container">
        <div>
          <span>Secret Message: </span>
            <h3>
              {secretMessage}
            </h3>
        </div>
        <div className="d-flex justify-content-center">
          <button onClick={signoutHandler} className="btn btn-primary mt-3">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default SecretPanel;
