# Predex Smart Contracts

Polymarket-style prediction market smart contracts with hybrid Web3 architecture.

## Architecture

```
MarketFactory.sol  → Creates and tracks all markets
Market.sol         → Individual market (trading, expiry, resolution, payouts)
```

## Features

### Market.sol

- ✅ ERC-1155 outcome tokens
- ✅ AMM-style trading (buy/sell shares)
- ✅ On-chain expiry enforcement
- ✅ Oracle-based resolution
- ✅ Proportional payouts
- ✅ Builder attribution (events)
- ✅ Platform fee collection

### MarketFactory.sol

- ✅ Market creation (Admin/Builder roles)
- ✅ Market registry & metadata
- ✅ Category indexing
- ✅ Platform fee management
- ✅ Role-based access control

## Setup

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run local node
npm run node

# Deploy to local
npm run deploy:local

# Run tests
npm test
```

## Usage

### Create a Market

```solidity
// Get factory instance
MarketFactory factory = MarketFactory(factoryAddress);

// Create market
string[] memory outcomes = new string[](2);
outcomes[0] = "Yes";
outcomes[1] = "No";

address market = factory.createMarket(
    "Will Bitcoin reach $100k?",
    "crypto",
    outcomes,
    block.timestamp + 30 days,
    oracleAddress
);
```

### Trade on Market

```solidity
Market market = Market(marketAddress);

// Buy shares
market.buyShares{value: 1 ether}(0, bytes32(0));

// Sell shares
market.sellShares(0, 100, bytes32(0));
```

### Resolve Market

```solidity
// Oracle resolves after expiry
market.resolveMarket(0); // Outcome 0 wins

// Users claim payouts
market.claimPayout();
```

## Roles

- **Admin**: Create markets, manage platform
- **Builder**: Create markets, earn attribution rewards
- **Oracle**: Resolve market outcomes
- **User**: Trade and earn

## Security

- ✅ ReentrancyGuard on all fund transfers
- ✅ Access control for sensitive functions
- ✅ Expiry enforcement prevents post-expiry trading
- ✅ Resolution is immutable after oracle submission
- ✅ Emergency functions for edge cases

## Next Steps

1. Add comprehensive tests
2. Deploy to testnet (Sepolia)
3. Integrate with frontend
4. Add backend indexer
5. Implement oracle coordinator
