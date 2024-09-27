import React, { useEffect, useState } from "react";
import GetAssetValue from "../Helpers/GetAssetValue";
import { FiDownload, FiUpload } from "react-icons/fi";
import { BsArrowUp, BsArrowDown, BsArrowLeftRight } from "react-icons/bs";
import { TbArrowsShuffle } from "react-icons/tb";
import ClipAddr from "../Helpers/ClipAddr";
import GetPoolValue from "../Helpers/GetPoolValue";
import GetMemo from "../Helpers/GetMemo";
import { useNavigate } from "react-router-dom";

function Transaction(props) {
  const [icon, setIcon] = useState("?");
  const [msg, setMsg] = useState("?");
  const [time, setTime] = useState("?");
  const [val, setVal] = useState("?");
  const [date, setDate] = useState("?");
  const [memo, setMemo] = useState("?");
  const [addrLink, setAddrLink] = useState();
  let navigate = useNavigate();
  useEffect(() => {
    // fetching memo here ensures we only call api when displaying the transaction
    (async () => {
      let m = await GetMemo(props.transHash);
      setMemo(m);
    })();
  }, []);

  useEffect(() => {
    const timeStamp = new Date(props.time).toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: true,
      timeZone: "CST",
    });
    const dateStamp = new Date(props.time).toLocaleDateString("en", {
      dateStyle: "short",
      timeZone: "CST",
    });
    setDate(dateStamp);
    setTime(timeStamp, dateStamp);
    if (props.type == "payment" && props.acctID != props.srcAcct) {
      // account is recieving an asset
      setIcon(<BsArrowDown color="green" size={"1.2rem"} />);
      setMsg("Recieved " + props.amount + " " + props.asset + " from ");
      setAddrLink(
        <a
          onClick={() => {
            navigate("/Dashboard", { state: { address: props.srcAcct } });
            window.location.reload(false);
          }}
        >
          {ClipAddr(props.srcAcct)}
        </a>
      );
      GetAssetValue(props.asset, props.issuer, props.amount).then((v) => {
        setVal(v.toFixed(4));
      });
    } else if (props.type == "payment" && props.acctID == props.srcAcct) {
      // acount is sending an asset
      setIcon(<BsArrowUp color="red" size={"1.2rem"} />);
      setMsg("Sent " + props.amount + " " + props.asset + " to ");
      setAddrLink(
        <a
          onClick={() => {
            navigate("/Dashboard", { state: { address: props.destAcct } });
            window.location.reload(false);
          }}
        >
          {ClipAddr(props.destAcct)}
        </a>
      );
      GetAssetValue(props.asset, props.issuer, props.amount).then((v) => {
        setVal(v.toFixed(4));
      });
    } else if (
      props.type == "path_payment_strict_send" &&
      props.srcAcct == props.destAcct
    ) {
      // swapping assets
      setIcon(<TbArrowsShuffle size={"1.5rem"} />);
      setMsg("Swapped " + props.srcAsset + " to " + props.asset);
      GetAssetValue(props.asset, props.issuer, props.amount).then((v) => {
        setVal(v.toFixed(4));
      });
    } else if (props.type == "liquidity_pool_deposit") {
      // deposit value to liquidity pool
      setIcon(<FiDownload size={"1.5rem"} />);
      setMsg(
        "Deposited to " +
          props.poolAsset1 +
          "/" +
          props.poolAsset2 +
          " liquidity pool"
      );
      GetPoolValue(props.poolID, props.poolShares).then((v) => {
        setVal(v.toFixed(4));
      });
    } else if (props.type == "liquidity_pool_withdraw") {
      setIcon(<FiUpload size={"1.5rem"} />);
      setMsg(
        "Withdrew from " +
          props.poolAsset1 +
          "/" +
          props.poolAsset2 +
          " liquidity pool"
      );
      GetPoolValue(props.poolID, props.poolShares).then((v) => {
        setVal(v.toFixed(4));
      });
    } else if (props.type == "claim_claimable_balance") {
      setIcon(<BsArrowDown color="green" size={"1.2rem"} />);
      setMsg("Claimed balance from ");
      setVal("See transaction above for info on asset");
      setAddrLink(
        <a
          onClick={() => {
            navigate("/Dashboard", { state: { address: props.srcAcct } });
            window.location.reload(false);
          }}
        >
          {ClipAddr(props.srcAcct)}
        </a>
      );
    } else if (props.type == "manage_buy_offer") {
      if (props.amount != 0) {
        setMsg(
          "Buying " +
            props.asset +
            " with " +
            props.selling_asset +
            " at " +
            props.price +
            " " +
            props.selling_asset +
            "/" +
            props.asset
        );
      } else {
        setMsg(
          "Cancelled buy offer for " +
            props.asset +
            " at " +
            props.price +
            " " +
            props.buying_asset +
            "/" +
            props.selling_asset
        );
      }
      setIcon(<BsArrowLeftRight size={"1.5rem"} />);
      let amount = props.amount * props.price;
      if (props.selling_asset != "USDC") {
        GetAssetValue(props.selling_asset, props.issuer, amount).then((v) => {
          setVal(v.toFixed(4));
        });
      } else {
        setVal(amount.toFixed(4));
      }
    } else if (props.type == "manage_sell_offer") {
      if (props.amount != 0) {
        setMsg(
          "Selling " +
            props.asset +
            " for " +
            props.buying_asset +
            " at " +
            props.price +
            " " +
            props.buying_asset +
            "/" +
            props.selling_asset
        );
      } else {
        setMsg(
          "Cancelled sell offer for " +
            props.asset +
            " at " +
            props.price +
            " " +
            props.buying_asset +
            "/" +
            props.selling_asset
        );
      }
      setIcon(<BsArrowLeftRight size={"1.5rem"} />);
      let amount = props.amount * props.price;
      if (props.selling_asset != "USDC") {
        GetAssetValue(props.selling_asset, props.issuer, amount).then((v) => {
          setVal(v.toFixed(4));
        });
      } else {
        setVal(amount.toFixed(4));
      }
    } else {
    }
  }, []);
  return (
    <div className="assets-container">
      <div className="trade">
        <div className="icon-memo">
          {icon}
          <p className="light">{memo}</p>
        </div>
        <div className="msg-val">
          <div className="msg-link">
            <p>
              {msg} {addrLink}
            </p>
          </div>
          <p className="light">${val} USD</p>
        </div>
        <div className="time-stamp">
          <p>{time}</p>
          <p className="light">{date}</p>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
