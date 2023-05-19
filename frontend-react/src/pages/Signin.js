import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from '@polkadot/util';

import Form from 'react-bootstrap/Form';

// backend api endpoint for signin..
const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const Signin = (props) => {
  const navigate = useNavigate(); // for routing

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(0);

  async function getAddress() {
    await web3Enable('react-front')
    // returns an array of { address, meta: { name, source } }
    // meta.source contains the name of the extension that provides this account
    const allAccounts = await web3Accounts();
    const _accounts = allAccounts.map((account, i) => {
      return {
        id: i,
        name: account.meta.name,
        address: account.address,
        injector: account.meta.source
      }
    })
    setAccounts(_accounts);
  }

  async function getSignature(message) {
    const injector = await web3FromSource(accounts[selectedAddressId].injector);
    const signRaw = injector?.signer?.signRaw;

    if (!!signRaw) {
      // after making sure that signRaw is defined
      // we can use it to sign our message
      const { signature } = await signRaw({
        address: accounts[selectedAddressId].address,
        data: stringToHex(message),
        type: 'bytes'
      });

      return signature;
    }
    return null;
  }

  useEffect(() => {
    getAddress();

  }, [])

  const signinHandler = async (event) => {
    event.preventDefault();

    if (loading || accounts.length === 0) {
      setError('Please connect wallet.')
      return;
    };

    setLoading(true);
    setError(null);
    try {
      const address = accounts[selectedAddressId].address;
      const message = `Sign-in request for address ${address}`;
      const signature = await getSignature(message);

      if (!signature) {
        // set error
        setError('Cannot sign message.')
        setLoading(false);
        return;
      }

      const signinData = {
        address,
        message,
        signature
      };

      // api request POST api/signin
      const { data } = await axios.post(`${BACKEND_API}/signin`, signinData);

      // session processing
      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        navigate('/secret');
      }
    } catch (error) {
      console.log(error);
      setError('Cannot signin');
    }
    setLoading(false);
  };

  const onChangeHandler = (event) => {
    setSelectedAddressId(event.target.value);
  }

  return (
    <>
      <div className="container">
        <div>
          {accounts.length > 0 && <Form.Group className="mb-2">
            <Form.Label htmlFor="select-account" className="mt-3">Address</Form.Label>
            <Form.Select
              id="select"
              label="Address"
              onChange={onChangeHandler}
            >
              {accounts.map((account, i) =>
                <option value={account.id} key={i}>{account.name}</option>
              )}
            </Form.Select>
          </Form.Group>}
          {accounts.length > 0 && <><span>Selected Address: </span> {accounts[selectedAddressId].address}</>}
        </div>

        <div className="d-flex justify-content-center">
          <button onClick={signinHandler} className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Signing...' : 'Sign In'}
          </button>
        </div>
        {error && <span class="error-span">{error}</span>}
      </div>
    </>
  );
};

export default Signin;
