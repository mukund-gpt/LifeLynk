// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BloodDonation {
    address public owner;

    struct HospitalInfo {
        string name;
        string location;
    }

    // Authorized hospitals with details
    mapping(address => HospitalInfo) public hospitalDetails;
    mapping(address => bool) public isHospital;

    struct DonationRecord {
        address hospital;
        address donor;
        string donorEmail;
        string patientName;
        string patientEmail;
        uint256 timestamp;
    }

    // Records indexed by hospital and donor
    mapping(address => DonationRecord[]) public donationsReceivedByHospital;
    mapping(address => DonationRecord[]) public donationsGivenByDonor;

    // Events for off-chain tracking
    event HospitalRegistered(
        address indexed hospital,
        string name,
        string location
    );
    event DonationRecorded(
        address indexed hospital,
        address indexed donor,
        string donorEmail,
        string patientName,
        string patientEmail
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyHospital() {
        require(isHospital[msg.sender], "Caller not verified hospital");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Owner registers a hospital with name & location
    function registerHospital(
        address _hospital,
        string calldata _name,
        string calldata _location
    ) external onlyOwner {
        require(_hospital != address(0), "Invalid hospital address");
        require(!isHospital[_hospital], "Hospital already registered");
        hospitalDetails[_hospital] = HospitalInfo({
            name: _name,
            location: _location
        });
        isHospital[_hospital] = true;
        emit HospitalRegistered(_hospital, _name, _location);
    }

    /// @notice Hospital records a donation with donor & patient emails
    function recordDonation(
        address _donor,
        string calldata _donorEmail,
        string calldata _patientName,
        string calldata _patientEmail
    ) external onlyHospital {
        require(_donor != address(0), "Invalid donor address");

        DonationRecord memory rec = DonationRecord({
            hospital: msg.sender,
            donor: _donor,
            donorEmail: _donorEmail,
            patientName: _patientName,
            patientEmail: _patientEmail,
            timestamp: block.timestamp
        });

        donationsReceivedByHospital[msg.sender].push(rec);
        donationsGivenByDonor[_donor].push(rec);

        emit DonationRecorded(
            msg.sender,
            _donor,
            _donorEmail,
            _patientName,
            _patientEmail
        );
    }

    /// @notice Get all donation records for a hospital
    function getDonationsByHospital(
        address _hospital
    ) external view returns (DonationRecord[] memory) {
        return donationsReceivedByHospital[_hospital];
    }

    /// @notice Get all donation records for a donor
    function getDonationsByDonor(
        address _donor
    ) external view returns (DonationRecord[] memory) {
        return donationsGivenByDonor[_donor];
    }
}
