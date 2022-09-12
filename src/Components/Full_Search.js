import React, { useState } from "react";
import "../CSS/main.css";
import { useNavigate } from "react-router-dom";

function Full_Search() {
  let navigate = useNavigate();
  let [address, setAddress] = useState("");
  return (
    <div className="Full_Search">
      <div className="content">
        <p>Input a Stellar Wallet address</p>
        <div className="search_input_container">
          <form>
            <input
              placeholder="GCEXAMPLE5H..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            ></input>
            <button
              onClick={() =>
                navigate("/Dashboard", { state: { address: address } })
              }
            >
              Search!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Full_Search;
