require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_KEY = process.env.POLYGON_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.23",
		settings: {
		  optimizer: {
			enabled: true,
			runs: 200
		  }
		}
	  },
  networks: {
	  fantom: {
		url: "https://eth-sepolia.public.blastapi.io",
		chainId: 11155111,
		accounts: [PRIVATE_KEY],
	  },
	binance_test: {
	  url: "https://data-seed-prebsc-1-s1.binance.org:8545",
	  chainId: 97,
	  accounts: [PRIVATE_KEY],
	},
	polygon_mumbai: {
	  url: "https://polygon-mumbai-bor-rpc.publicnode.com",
	  chainId: 80001,
	  accounts: [PRIVATE_KEY]
	},
	polygon: {
	  url: "https://polygon-rpc.com",
	  chainId: 137,
	 accounts: [PRIVATE_KEY],
	  gasMultiplier: 1.2,
	},
  },
  etherscan: {
	  apiKey: [POLYGON_KEY]
	}
};
