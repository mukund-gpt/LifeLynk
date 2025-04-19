import React, { useEffect, useState } from "react";
import { getContract } from "../contracts/contract";

const HospitalDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual logged-in hospital's Mongo ID
  const hospitalMongoId = "680259a89fa10887411ff415";

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        const records = await contract.getDonationsReceivedByHospital(
          hospitalMongoId
        );
        setDonations(records);
        console.log(records);
      } catch (error) {
        console.error("❌ Error fetching donation records:", error);
        alert("Failed to fetch donation records from the blockchain");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        📋 Donations Received by Hospital
      </h1>

      {loading ? (
        <p>Loading donation records...</p>
      ) : donations.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4 border">
              <p>
                <strong>👤 Donor:</strong> {donation.donor.name}
              </p>
              <p>
                <strong>🩸 Blood Group:</strong> {donation.bloodGroup}
              </p>
              <p>
                <strong>💉 Units Donated:</strong>{" "}
                {Number(donation.unitsDonated)}
              </p>
              <p>
                <strong>🧑‍⚕️ Patient:</strong> {donation.patient.name}
              </p>
              <p>
                <strong>📞 Contact:</strong> {donation.patient.contact}
              </p>
              <p>
                <strong>📅 Time:</strong>{" "}
                {new Date(Number(donation.timestamp) * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDonations;
