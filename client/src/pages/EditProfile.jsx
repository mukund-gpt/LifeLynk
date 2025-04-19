import React, { useEffect, useState } from "react";
import { updateUser, fetchCurrentUser } from "../apis/userApi";
import { reverseGeocode } from "../apis/locationApi"; // Import reverseGeocode API
import {toast} from "react-hot-toast"

const DonorProfile = () => {
  const [donor, setDonor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [address, setAddress] = useState("Fetching...");

  const handleChange = (field, value) => {
    setDonor((prev) => ({ ...prev, [field]: value }));
  };

  const fetchMetaMaskAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
  
        const updatedDonor = {
          ...donor,
          metaMaskId: accounts[0],
        };
  
        setDonor(updatedDonor); // update state
  
        // Optional: Immediately save to backend (or rely on Save button)
        // await updateUser(updatedDonor);
  
        toast.success("MetaMask updated successfully!");
      } catch (err) {
        console.error("MetaMask connection error:", err);
        toast.error("Failed to connect MetaMask");
      }
    } else {
      toast.error("MetaMask not detected");
    }
  };
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Before Saving :",donor);
      await updateUser(donor);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true); // Set loading state
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Prepare location data in GeoJSON format
          const location = {
            type: "Point",
            coordinates: [longitude, latitude], // [lng, lat]
          };

          setDonor((prev) => ({
            ...prev,
            location, // Update location in donor profile
          }));

          // Use reverseGeocode API to get the address
          reverseGeocode(latitude, longitude)
            .then((data) => {
              const address = data || "Unknown location";
              setAddress(address); // frontend only
              setDonor((prev) => ({
                ...prev,
                address,
              }));
              setIsFetchingLocation(false);
              toast.success("Location updated successfully!");
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              toast.error("Failed to fetch location.");
              setIsFetchingLocation(false);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to get location.");
          setIsFetchingLocation(false);
          setDonor((prev) => ({
            ...prev,
            address: "Geolocation error",
          }));
        }
      );
    } else {
      toast.error("Geolocation not supported.");
      setIsFetchingLocation(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchCurrentUser();
        setDonor(res?.data?.donor || {});
        
      } catch (err) {
        toast.error("Failed to fetch user");
        console.error("Error fetching user:", err);
      }
    };
    loadUser();
  }, []);

  if (!donor) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Edit Donor Profile
          </h2>
          <button
            onClick={editMode ? handleSave : () => setEditMode(true)}
            disabled={isSaving}
            className={`px-8 py-3 rounded-md text-white font-semibold ${
              editMode
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editMode ? (isSaving ? "Saving..." : "Save") : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={donor.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={donor.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contact
            </label>
            <input
              type="text"
              value={donor.contact || ""}
              onChange={(e) => handleChange("contact", e.target.value)}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Blood Type
            </label>
            <select
              value={donor.bloodGroup || ""}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MetaMask ID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              MetaMask ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={donor.metaMaskId || ""}
                onChange={(e) => handleChange("metaMaskId", e.target.value)}
                disabled={!editMode}
                className="w-full border border-gray-300 rounded-md p-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {editMode && (
                <button
                  type="button"
                  onClick={fetchMetaMaskAddress}
                  className="px-6 py-3 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={donor.address || "Not Set"}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!editMode}
                className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {editMode && !donor.address && (
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={isFetchingLocation}
                  className="px-6 py-3 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  {isFetchingLocation ? "Fetching..." : "Get Location"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
