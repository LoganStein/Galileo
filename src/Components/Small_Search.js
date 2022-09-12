import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {AiOutlineSearch} from "react-icons/ai"

function Small_Search(props) {
  const [addr, setAddr] = useState();
  let navigate = useNavigate();
  return (
    <div>
      <div>
        <div className="small_search">
          <form
            onSubmit={(e) => {
              if (addr) {
                navigate("/Dashboard", { state: { address: addr } });
                window.location.reload(false);
              }else{
                alert("no address given")
              }
              e.preventDefault();
            }}
          >
            <input
              placeholder="GEXAMPLE..."
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
            ></input>
            <button className="small-search-btn" type="submit">
              <AiOutlineSearch />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Small_Search;
