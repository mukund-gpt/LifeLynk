import { getContract } from "../contracts/contract";

export const recordDonationOnChain = async (requestToLog) => {
  if (!requestToLog) {
    console.error("Missing request data");
    return false;
  }

  try {
    const contract = await getContract();

    const donor = {
      name: requestToLog.donor.name,
      contact: requestToLog.donor.contact,
      email: requestToLog.donor.email,
      mongoId: requestToLog.donor._id,
    };

    const patient = {
      name: requestToLog.patientName,
      age: 0,
      email: "",
      contact: requestToLog.contactNumber,
    };

    const hospital = {
      name: requestToLog.hospital.name,
      location: "unknown",
      mongoId: requestToLog.hospital._id,
    };

    const tx = await contract.recordDonation(
      requestToLog.donor.metaMaskId,
      donor,
      patient,
      hospital,
      requestToLog.bloodGroup,
      requestToLog.unitsRequired
    );

    await tx.wait();
    console.log("✅ Donation recorded on blockchain");
    return true;
  } catch (err) {
    console.error("❌ Blockchain error:", err);
    return false;
  }
};
