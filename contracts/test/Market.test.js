const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Predex Prediction Market", function () {
  let factory, market;
  let owner, oracle, trader1, trader2;
  let marketAddress;

  const QUESTION = "Will Bitcoin reach $100k?";
  const CATEGORY = "crypto";
  const OUTCOMES = ["Yes", "No"];
  
  beforeEach(async function () {
    // Get signers
    [owner, oracle, trader1, trader2] = await ethers.getSigners();

    // Deploy factory
    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    factory = await MarketFactory.deploy(owner.address);
    await factory.waitForDeployment();

    // Create a market
    const expiryTime = await time.latest() + 30 * 24 * 60 * 60; // 30 days
    const tx = await factory.createMarket(
      QUESTION,
      CATEGORY,
      OUTCOMES,
      expiryTime,
      oracle.address
    );
    
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => {
      try {
        return factory.interface.parseLog(log).name === "MarketCreated";
      } catch {
        return false;
      }
    });
    
    marketAddress = factory.interface.parseLog(event).args.marketAddress;
    market = await ethers.getContractAt("Market", marketAddress);
  });

  describe("Factory", function () {
    it("Should deploy factory correctly", async function () {
      expect(Number(await factory.getTotalMarkets())).to.equal(1);
    });

    it("Should create market with correct data", async function () {
      const [question, category, , , , creator, , isActive] = await factory.getMarketMetadata(marketAddress);
      expect(question).to.equal(QUESTION);
      expect(category).to.equal(CATEGORY);
      expect(creator).to.equal(owner.address);
      expect(isActive).to.equal(true);
    });

    it("Should only allow admins/builders to create markets", async function () {
      const expiryTime = await time.latest() + 30 * 24 * 60 * 60;
      let reverted = false;
      try {
        await factory.connect(trader1).createMarket(
          "Test Market",
          "test",
          OUTCOMES,
          expiryTime,
          oracle.address
        );
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });

    it("Should grant builder role", async function () {
      await factory.addBuilder(trader1.address);
      expect(await factory.isBuilder(trader1.address)).to.equal(true);
    });
  });

  describe("Trading", function () {
    it("Should allow buying shares", async function () {
      const buyAmount = ethers.parseEther("1");
      await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: buyAmount });

      const shares = await market.getUserPosition(trader1.address, 0);
      expect(shares > 0n).to.be.true;
    });

    it("Should allow selling shares", async function () {
      // First buy shares
      const buyAmount = ethers.parseEther("1");
      await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: buyAmount });
      const shares = await market.getUserPosition(trader1.address, 0);

      // Then sell half
      const sellShares = shares / 2n;
      await market.connect(trader1).sellShares(0, sellShares, ethers.ZeroHash);

      const remainingShares = await market.getUserPosition(trader1.address, 0);
      expect(remainingShares < shares).to.be.true;
    });

    it("Should emit TradeExecuted event", async function () {
      const buyAmount = ethers.parseEther("1");
      const tx = await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: buyAmount });
      const receipt = await tx.wait();
      expect(receipt.logs.length).to.be.greaterThan(0);
    });

    it("Should update prices after trades", async function () {
      const initialPrice = await market.getOutcomePrice(0);
      
      await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: ethers.parseEther("1") });
      
      const newPrice = await market.getOutcomePrice(0);
      expect(newPrice).to.not.equal(initialPrice);
    });

    it("Should prevent trading after expiry", async function () {
      // Fast forward past expiry
      const expiryTime = (await market.expiryTime());
      await time.increaseTo(expiryTime + 1n);

      let reverted = false;
      try {
        await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: ethers.parseEther("1") });
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });
  });

  describe("Expiry & Resolution", function () {
    it("Should allow anyone to trigger expiry", async function () {
      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);

      await market.connect(trader1).triggerExpiry();
      expect(await market.isClosed()).to.equal(true);
    });

    it("Should only allow oracle to resolve", async function () {
      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);

      let reverted = false;
      try {
        await market.connect(trader1).resolveMarket(0);
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });

    it("Should resolve market correctly", async function () {
      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);

      await market.connect(oracle).resolveMarket(0);
      
      expect(await market.isResolved()).to.equal(true);
      expect(Number(await market.winningOutcomeId())).to.equal(0);
    });
  });

  describe("Payouts", function () {
    it("Should allow claiming payouts after resolution", async function () {
      // Trader buys shares
      await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: ethers.parseEther("1") });

      // Fast forward and resolve
      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);
      await market.connect(oracle).resolveMarket(0);

      // Claim payout
      const initialBalance = await ethers.provider.getBalance(trader1.address);
      const tx = await market.connect(trader1).claimPayout();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(trader1.address);
      expect(finalBalance > (initialBalance - gasCost)).to.be.true;
    });

    it("Should burn shares after claiming", async function () {
      await market.connect(trader1).buyShares(0, ethers.ZeroHash, { value: ethers.parseEther("1") });

      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);
      await market.connect(oracle).resolveMarket(0);

      await market.connect(trader1).claimPayout();
      
      const shares = await market.getUserPosition(trader1.address, 0);
      expect(Number(shares)).to.equal(0);
    });

    it("Should not allow claiming without winning shares", async function () {
      await market.connect(trader1).buyShares(1, ethers.ZeroHash, { value: ethers.parseEther("1") });

      const expiryTime = await market.expiryTime();
      await time.increaseTo(expiryTime + 1n);
      await market.connect(oracle).resolveMarket(0); // Outcome 0 wins

      let reverted = false;
      try {
        await market.connect(trader1).claimPayout();
      } catch (error) {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });
  });

  describe("Market Info", function () {
    it("Should return correct market info", async function () {
      const [question, expiryTime, totalOutcomes, isClosed, isResolved] = await market.getMarketInfo();
      
      expect(question).to.equal(QUESTION);
      expect(Number(totalOutcomes)).to.equal(2);
      expect(isClosed).to.equal(false);
      expect(isResolved).to.equal(false);
    });

    it("Should return correct outcome data", async function () {
      const [label, , , price] = await market.getOutcome(0);
      expect(label).to.equal("Yes");
      expect(price > 0n).to.be.true;
    });
  });
});
