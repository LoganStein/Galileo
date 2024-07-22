import React from "react";

function Filter() {
  return (
    <div className="filter-container">
      <div>
        <label>Token</label>
        <select>
          {/* populate with only tokens that the account holds */}
          <option>Select a Token</option>
          <option>yUSDC</option>
          <option>USDC</option>
          <option>XLM</option>
        </select>
      </div>
      <div>
        <label>TX Type</label>
        <select>
          <option>Send</option>
          <option>Recieve</option>
          <option>Swap</option>
          <option>Deposit</option>
          <option>Withdrawl</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
