import React from "react";
import { Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId
  };

  console.log(data);
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
  console.log("IPFS", IPFSUrl);
  const isDisabled = !data.data.currentlyListed;
  console.log("currentlyListed", data.data.currentlyListed)
  console.log("isDisabled", isDisabled)

  return (
    <div className="p-1">
      <Link to={isDisabled?'#':newTo}>
        <div
          className={`border-b-2 border-gray-700 mx-12 my-5 mb-12 rounded-xl bg-gray-800 w-64 md:w-96 shadow-xl overflow-hidden transition duration-300 hover:bg-blue-900 ${isDisabled ? "opacity-50" : ""}`}
        >
          <img
            src={IPFSUrl}
            alt=""
            className="w-3/4 mx-auto mt-4 mb-2 object-contain"
            crossOrigin="anonymous"
          />
          <div className="p-4">
            <h2 className="text-white text-2xl font-bold">{data.data.name}</h2>
            <p className="text-gray-300 text-sm mt-2">{data.data.description}</p>
            {isDisabled && (
              <div className="flex items-center justify-center text-red-500 text-lg font-bold mt-4">
                Sold Out
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default NFTTile;
