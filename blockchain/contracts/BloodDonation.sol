// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BloodDonation {
    address public owner;

    struct DonorInfo {
        string name;
        string contact;
        string email;
        string mongoId;
    }

    struct PatientInfo {
        string name;
        uint256 age;
        string email;
        string contact;
    }

    struct HospitalInfo {
        string name;
        string location;
        string mongoId;
    }

    struct DonationRecord {
        address hospitalMetaMask;
        address donorMetaMask;
        DonorInfo donor;
        PatientInfo patient;
        HospitalInfo hospital;
        string bloodGroup;
        uint256 unitsDonated;
        uint256 timestamp;
    }

    mapping(string => DonationRecord[]) public donationsByDonor;
    mapping(string => DonationRecord[]) public donationsReceivedByHospital;

    event DonationRecorded(
        string indexed donorMongoId,
        string indexed hospitalMongoId,
        string patientName,
        string patientEmail,
        string patientContact,
        string bloodGroup,
        uint256 unitsDonated
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Hospital records a donation with grouped donor, patient, and hospital info
    function recordDonation(
        address donorMetaMask,
        DonorInfo calldata donor,
        PatientInfo calldata patient,
        HospitalInfo calldata hospital,
        string calldata bloodGroup,
        uint256 unitsDonated
    ) external {
        require(bytes(donor.mongoId).length > 0, "Invalid donor Mongo ID");
        require(
            bytes(hospital.mongoId).length > 0,
            "Invalid hospital Mongo ID"
        );

        DonationRecord memory rec = DonationRecord({
            hospitalMetaMask: msg.sender,
            donorMetaMask: donorMetaMask,
            donor: donor,
            patient: patient,
            hospital: hospital,
            bloodGroup: bloodGroup,
            unitsDonated: unitsDonated,
            timestamp: block.timestamp
        });

        // push to MongoID-based mappings only
        donationsByDonor[donor.mongoId].push(rec);
        donationsReceivedByHospital[hospital.mongoId].push(rec);

        emit DonationRecorded(
            donor.mongoId,
            hospital.mongoId,
            patient.name,
            patient.email,
            patient.contact,
            bloodGroup,
            unitsDonated
        );
    }

    /// @notice Get all donation records for a donor (by MongoDB ID)
    function getDonationsByDonor(
        string calldata donorMongoId
    ) external view returns (DonationRecord[] memory) {
        return donationsByDonor[donorMongoId];
    }

    /// @notice Get all donation records for a hospital (by MongoDB ID)
    function getDonationsReceivedByHospital(
        string calldata hospitalMongoId
    ) external view returns (DonationRecord[] memory) {
        return donationsReceivedByHospital[hospitalMongoId];
    }
}
