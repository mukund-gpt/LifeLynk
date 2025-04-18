const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const BloodDonation = await hre.ethers.getContractFactory("BloodDonation");

  const donation = await BloodDonation.deploy();
  await donation.waitForDeployment();

  console.log("✅ BloodDonation deployed to:", await donation.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
