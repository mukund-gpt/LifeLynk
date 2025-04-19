import { ethers } from "ethers";
import ABI from "../abi/BloodDonationABI.json";

const CONTRACT_ADDRESS = "0xBa1BF52799d5Fc231117AC2c728AEAb4835D3416";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}
