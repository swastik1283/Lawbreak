import React,{useState} from "react";
import {ethers} from "ethers";
import { NavLink } from "react-router-dom";



const WalletLogin=()=>{
    const[address,setAddress]=useState("");
    const[loggedIn,setLoggedIn]=useState(false);


    const connectWallet=async()=>{
        if(!window.ethereum){
            alert("metamask not detected");
            return;
        }

        const provider=new ethers.BrowserProvider(window.ethereum);
        const accounts= await provider.send("eth_required");
        setAddress(accounts[0]);

        const nonce="Login to Game"+Math.floor(Math.random()*1000000);

        const signer=await provider.getSigner();
        const signature=await signer.signMessage(nonce);

        console.log("Address:",accounts[0]);
        console.log("Nonce:",nonce);
        console.log("Signature:",signature);


        setLoggedIn(true);
    }

    return(
        <div className="p-4">
            {loggedIn ?(
                <div>
                    "Logged in as"<b>{address}</b>
                     <NavLink to="/game" className="text-blue-600 underline">
            Go to Game
          </NavLink>
                    </div>):(
                        <button
                    onClick={connectWallet}
                className="px-4 py-2 bg-blue-600 text-white rounded">
                    Login with wallet
                </button>
            )}
        </div>
    );
};

export default WalletLogin;