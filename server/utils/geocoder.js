import NodeGeocoder from "node-geocoder";

const options = {
  provider: "openstreetmap", // or use 'google', 'mapquest', etc.
};

const geocoder = NodeGeocoder(options);

export default geocoder;
