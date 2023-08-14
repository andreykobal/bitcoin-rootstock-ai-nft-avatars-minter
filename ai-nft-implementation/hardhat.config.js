require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const privateKey = process.env.MNEMONIC
const maticUrl = process.env.MATIC_APP_ID
const polyScan = process.env.POLYGONSCAN
module.exports = {
  solidity: "0.8.0",
  networks: {
    klaytnBaobab: {
      chainId: 1001,
      url: "https://public-en-baobab.klaytn.net",
      accounts: [privateKey]
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [privateKey]   
    }
  },
  //* Keep name as 'etherscan' to avoid errors.
  etherscan: {
    url: 'https://polygonscan.com/',
    apiKey: polyScan,
  }
};
