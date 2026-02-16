const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Predex Contracts...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log();

  // Deploy MarketFactory
  console.log("📦 Deploying MarketFactory...");
  const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
  const factory = await MarketFactory.deploy(deployer.address); // Fee recipient = deployer
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ MarketFactory deployed to:", factoryAddress);
  console.log();

  // Create a sample market
  console.log("📊 Creating sample market...");
  
  const question = "Will Bitcoin reach $100k before March 2026?";
  const category = "crypto";
  const outcomes = ["Yes", "No"];
  const expiryTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
  const oracle = deployer.address; // For demo, deployer is oracle

  const tx = await factory.createMarket(
    question,
    category,
    outcomes,
    expiryTime,
    oracle
  );
  
  const receipt = await tx.wait();
  
  // Get market address from event
  const marketCreatedEvent = receipt.logs.find(
    log => {
      try {
        return factory.interface.parseLog(log).name === "MarketCreated";
      } catch {
        return false;
      }
    }
  );
  
  const marketAddress = factory.interface.parseLog(marketCreatedEvent).args.marketAddress;
  console.log("✅ Sample market created at:", marketAddress);
  console.log("   Question:", question);
  console.log("   Category:", category);
  console.log("   Expiry:", new Date(expiryTime * 1000).toLocaleString());
  console.log();

  // Summary
  console.log("🎉 Deployment Summary:");
  console.log("================================");
  console.log("MarketFactory:", factoryAddress);
  console.log("Sample Market:", marketAddress);
  console.log("Network:", hre.network.name);
  console.log("================================");
  console.log();
  console.log("💡 Next steps:");
  console.log("1. Save these addresses to your .env file");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Verify contracts on Etherscan (if testnet/mainnet)");
  console.log("4. Test trading functions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
