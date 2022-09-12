import React from "react";
import Header from "../Components/Header";
import "../CSS/About.css";

function About() {
  return (
    <div>
        <Header />
      <div className="container">
        <h1>About</h1>
        <div className="section">
          <h3>Why did I build this app?</h3>
          <p>
            I've been very interested in the{" "}
            <a href="https://stellar.org">Stellar blockchain</a> for a while
            now. There are so many reasons why stellar is my blockchain of
            choice. The transaction fees are extremely low, transactions clear
            in ~5 seconds rather than 30-60 minutes (like bitcoin), it's quick
            and easy to issue an asset making it very flexible and versitle, and
            love that the stellar blockchain uses far less energy than other
            blockchains (like bitcoin) and even less energy per transaction than
            VISA (
            <a href="https://stellar.org/blog/diving-into-energy-use-on-stellar-blockchain-payment-efficiency-examined">
              *citation
            </a>
            ).
          </p>
          <br />
          <p>
            Because I've been using stellar so much for so long I wanted to be able to check on my wallets
            quickly and easily. <a href="https://stellarx.com">StellarX</a> is a great website to do this,
            however, StellarX only allows you to view a wallet you're signed in with. I couldn't find any other
            apps or services that would allow me to get all the info StellarX might give but without signing in.
            I have more than one wallet and have set up my friends and family with stellar wallets as well and like to check in 
            on them from time to time. With this app its very easy to quickly see the total value, transactions,
             and assets in any wallet with just the public address.
          </p>
        </div>
        <div className="section">
          <h3>How did I build this app?</h3>
          <p>
            I used the React framework and the stellar horizon API to retrieve
            the data then parsed it in javascript for displaying. This was a really simple project technically speaking.
            There isn't much processing going on in the background. The majority of the code is just making API calls 
            and processing the data that is returned.
          </p>
        </div>
        <div className="section">
              <h3>Challenges I ran into</h3>
              <p>
                The biggest challenge with this project was reigning in the number of API calls I was making. 
                API calls are time-expensive and the stellar API has a limit of how many calls you can make 
                so it was important to keep the number of calls to a minimum.
                I solved this by focusing on managing the data I've recieved rather than calling the API again I 
                passed the data I already had around the the components that needed it. This was achieved with a 
                mix of context and prop drilling depending which made more sense for that instance.
              </p>
        </div>
        <div className="section">
          <h3>Limitations</h3>
          <p>
            Firstly this tool is not intended to be a trading platform so no transactions are created and no secret key is needed. 
            <a href="https://stellarx.com">StellarX</a> is great for that and has the same kind of dashboard. One limitation I found was 
            retreiving the USD value of an asset that is not very popular. If an asset doesn't have a liquidity pool for said asset and usdc 
            the value will display as $0.00. This doesn't mean that the asset has no value but rather that it't not popular 
            enough to have a ASSET/USDC liquidity pool. 
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
