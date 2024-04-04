const hre = require("hardhat");
const crypto = require("crypto");
const ethers = hre.ethers;
const {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} = require("@axelar-network/axelarjs-sdk");

const interchainTokenServiceContractABI = require("./utils/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("./utils/interchainTokenFactoryABI");
const interchainTokenContractABI = require("./utils/interchainTokenABI");

const interchainTokenServiceContractAddress =
  "0x8972f3CD9A3EFfD947398C4761e3Bd156C2F3d76";
const interchainTokenFactoryContractAddress = "0xd6ba705da1713f66925c46ebb9f6a9548c9e4213";
//const interchainTokenFactoryContractAddress = "0x6A91b9bC4D585c38cAa16962C3fCf27C0cDE828c";

  async function getSigner() {
	const [signer] = await ethers.getSigners();
	return signer;
  }

  async function getContractInstance(contractAddress, contractABI, signer) {
	return new ethers.Contract(contractAddress, contractABI, signer);
  }

  // Register and deploy a new interchain token to the Fantom testnet
async function registerAndDeploy() {
  // Generate random salt
  const salt = "0x" + crypto.randomBytes(32).toString("hex");

  // Create a new token
  const name = "VNDES";
  const symbol = "VDE";
  const decimals = 18;

  // Intial token supply
  const initialSupply = ethers.utils.parseEther("300000000");

  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Create contract instances
  const interchainTokenFactoryContract = await getContractInstance(
	interchainTokenFactoryContractAddress,
	interchainTokenFactoryContractABI,
	signer
  );
  const interchainTokenServiceContract = await getContractInstance(
	interchainTokenServiceContractAddress,
	interchainTokenServiceContractABI,
	signer
  );

  // Generate a unique token ID using the signer's address and salt
  const tokenId = await interchainTokenFactoryContract.interchainTokenId(
	signer.address,
	salt
  );

  // Retrieve new token address
  const tokenAddress =
	await interchainTokenServiceContract.interchainTokenAddress(tokenId);

  // Retrieve token manager address
  const expectedTokenManagerAddress =
	await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  // Deploy new Interchain Token
  const deployTxData =
	await interchainTokenFactoryContract.deployInterchainToken(
	  salt,
	  name,
	  symbol,
	  decimals,
	  initialSupply,
	  signer.address
	);

  console.log(
	`
  Deployed Token ID: ${tokenId},
  Token Address: ${tokenAddress},
  Transaction Hash: ${deployTxData.hash},
  salt: ${salt},
  Expected Token Manager Address: ${expectedTokenManagerAddress},
	 `
  );
}

async function main() {
  const functionName = process.env.FUNCTION_NAME;
  switch (functionName) {
	case "registerAndDeploy":
	  await registerAndDeploy();
	  break;
	default:
	  console.error(`Unknown function: ${functionName}`);
	  process.exitCode = 1;
	  return;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});