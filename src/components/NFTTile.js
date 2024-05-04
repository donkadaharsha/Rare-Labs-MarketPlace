import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile (data) {
    const newTo = {
        pathname:"/nftPage/"+data.data.tokenId
    }

    console.log(data)
    const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
    console.log("IPFS", IPFSUrl)

    return (
        <div className="p-1">
  <Link to={newTo}>
    <div className="border-b-2 border-gray-700 mx-12 my-5 mb-12 rounded-xl bg-gray-800 w-64 md:w-96 shadow-xl overflow-hidden transition duration-300 hover:bg-blue-900">
      <img src={IPFSUrl} alt="" className="w-3/4 mx-auto mt-4 mb-2 object-contain" crossOrigin="anonymous"/>
      <div className="p-4">
        <h2 className="text-white text-2xl font-bold">{data.data.name}</h2>
        <p className="text-gray-300 text-sm mt-2">{data.data.description}</p>
      </div>
    </div>
  </Link>
</div>

      
      
    )
}

export default NFTTile;
