require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    linea_sepolia: {
      url: process.env.LINEA_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 59141,
    },
  },
};
