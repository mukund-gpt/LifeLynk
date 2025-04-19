import { ethers } from "ethers";
import ABI from "../abi/BloodDonationABI.json";

const CONTRACT_ADDRESS = "0x867FCD1419Cd955E7EFbC85B7C2859F32f53c4B9";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}
