export const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || "Address not found";
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      return "Unable to fetch address";
    }
  };