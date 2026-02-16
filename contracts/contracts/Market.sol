// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Market
 * @notice Individual prediction market contract
 * @dev Handles trading, liquidity, expiry, resolution, and payouts for a single market
 */
contract Market is ERC1155, ReentrancyGuard, Ownable {
    
    // ============ State Variables ============
    
    string public question;
    uint256 public expiryTime;
    uint256 public createdAt;
    address public oracle;
    address public factory;
    
    bool public isClosed;
    bool public isResolved;
    uint256 public winningOutcomeId;
    
    uint256 public totalOutcomes;
    uint256 public totalVolume;
    uint256 public platformFee; // in basis points (100 = 1%)
    
    // Outcome data
    struct Outcome {
        string label;
        uint256 totalShares;
        uint256 liquidity;
        uint256 price; // in wei (scaled by 1e18)
    }
    
    mapping(uint256 => Outcome) public outcomes;
    mapping(address => uint256) public escrowedFunds;
    
    // ============ Events ============
    
    event TradeExecuted(
        address indexed user,
        uint256 indexed outcomeId,
        uint256 amount,
        uint256 shares,
        bool isBuy,
        bytes32 indexed builderId
    );
    
    event MarketClosed(uint256 timestamp);
    
    event MarketResolved(
        uint256 indexed winningOutcomeId,
        uint256 timestamp
    );
    
    event PayoutClaimed(
        address indexed user,
        uint256 amount,
        uint256 shares
    );
    
    event LiquidityAdded(
        uint256 indexed outcomeId,
        uint256 amount
    );
    
    // ============ Modifiers ============
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }
    
    modifier beforeExpiry() {
        require(block.timestamp < expiryTime, "Market expired");
        require(!isClosed, "Market closed");
        _;
    }
    
    modifier afterExpiry() {
        require(block.timestamp >= expiryTime || isClosed, "Market not expired");
        _;
    }
    
    modifier onlyResolved() {
        require(isResolved, "Market not resolved");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(
        string memory _question,
        string[] memory _outcomeLabels,
        uint256 _expiryTime,
        address _oracle,
        uint256 _platformFee
    ) ERC1155("") Ownable(msg.sender) {
        require(_expiryTime > block.timestamp, "Invalid expiry");
        require(_outcomeLabels.length >= 2, "Need at least 2 outcomes");
        require(_oracle != address(0), "Invalid oracle");
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        
        question = _question;
        expiryTime = _expiryTime;
        oracle = _oracle;
        factory = msg.sender;
        platformFee = _platformFee;
        totalOutcomes = _outcomeLabels.length;
        createdAt = block.timestamp;
        
        // Initialize outcomes
        for (uint256 i = 0; i < _outcomeLabels.length; i++) {
            outcomes[i] = Outcome({
                label: _outcomeLabels[i],
                totalShares: 0,
                liquidity: 0,
                price: 1e18 / _outcomeLabels.length // Equal initial probability
            });
        }
    }
    
    // ============ Trading Functions ============
    
    /**
     * @notice Buy outcome shares
     * @param outcomeId The outcome to buy
     * @param builderId Optional builder attribution ID
     */
    function buyShares(
        uint256 outcomeId,
        bytes32 builderId
    ) external payable beforeExpiry nonReentrant {
        require(outcomeId < totalOutcomes, "Invalid outcome");
        require(msg.value > 0, "Must send ETH");
        
        // Calculate shares based on current price (simplified AMM)
        uint256 shares = _calculateSharesFromAmount(outcomeId, msg.value);
        require(shares > 0, "Insufficient amount");
        
        // Update state
        outcomes[outcomeId].totalShares += shares;
        outcomes[outcomeId].liquidity += msg.value;
        escrowedFunds[msg.sender] += msg.value;
        totalVolume += msg.value;
        
        // Mint ERC1155 tokens
        _mint(msg.sender, outcomeId, shares, "");
        
        // Update price based on new liquidity (simplified LMSR)
        _updatePrice(outcomeId);
        
        emit TradeExecuted(
            msg.sender,
            outcomeId,
            msg.value,
            shares,
            true,
            builderId
        );
    }
    
    /**
     * @notice Sell outcome shares
     * @param outcomeId The outcome to sell
     * @param shares Amount of shares to sell
     * @param builderId Optional builder attribution ID
     */
    function sellShares(
        uint256 outcomeId,
        uint256 shares,
        bytes32 builderId
    ) external beforeExpiry nonReentrant {
        require(outcomeId < totalOutcomes, "Invalid outcome");
        require(shares > 0, "Must sell shares");
        require(balanceOf(msg.sender, outcomeId) >= shares, "Insufficient shares");
        
        // Calculate payout based on current price
        uint256 payout = _calculatePayoutFromShares(outcomeId, shares);
        require(payout > 0, "Insufficient payout");
        require(outcomes[outcomeId].liquidity >= payout, "Insufficient liquidity");
        
        // Update state
        outcomes[outcomeId].totalShares -= shares;
        outcomes[outcomeId].liquidity -= payout;
        escrowedFunds[msg.sender] -= payout;
        
        // Burn ERC1155 tokens
        _burn(msg.sender, outcomeId, shares);
        
        // Update price
        _updatePrice(outcomeId);
        
        // Transfer funds
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");
        
        emit TradeExecuted(
            msg.sender,
            outcomeId,
            payout,
            shares,
            false,
            builderId
        );
    }
    
    // ============ Pricing Functions (Simplified AMM) ============
    
    /**
     * @notice Calculate shares from ETH amount
     */
    function _calculateSharesFromAmount(
        uint256 outcomeId,
        uint256 amount
    ) internal view returns (uint256) {
        // Simplified: 1 ETH = shares / current price
        // In production, use LMSR or other sophisticated AMM
        uint256 price = outcomes[outcomeId].price;
        if (price == 0) return 0;
        
        return (amount * 1e18) / price;
    }
    
    /**
     * @notice Calculate payout from shares
     */
    function _calculatePayoutFromShares(
        uint256 outcomeId,
        uint256 shares
    ) internal view returns (uint256) {
        uint256 price = outcomes[outcomeId].price;
        return (shares * price) / 1e18;
    }
    
    /**
     * @notice Update outcome price based on liquidity
     * @dev Simplified price discovery - use LMSR or constant product for production
     */
    function _updatePrice(uint256 outcomeId) internal {
        uint256 totalLiquidity = 0;
        for (uint256 i = 0; i < totalOutcomes; i++) {
            totalLiquidity += outcomes[i].liquidity;
        }
        
        if (totalLiquidity == 0) return;
        
        // Price = outcome liquidity / total liquidity
        outcomes[outcomeId].price = (outcomes[outcomeId].liquidity * 1e18) / totalLiquidity;
    }
    
    /**
     * @notice Get current price for an outcome
     */
    function getOutcomePrice(uint256 outcomeId) external view returns (uint256) {
        require(outcomeId < totalOutcomes, "Invalid outcome");
        return outcomes[outcomeId].price;
    }
    
    // ============ Expiry & Resolution ============
    
    /**
     * @notice Trigger market expiry (anyone can call after expiry time)
     */
    function triggerExpiry() external afterExpiry {
        require(!isClosed, "Already closed");
        isClosed = true;
        emit MarketClosed(block.timestamp);
    }
    
    /**
     * @notice Resolve market with winning outcome (oracle only)
     */
    function resolveMarket(uint256 _winningOutcomeId) external onlyOracle afterExpiry {
        require(!isResolved, "Already resolved");
        require(_winningOutcomeId < totalOutcomes, "Invalid outcome");
        
        isResolved = true;
        winningOutcomeId = _winningOutcomeId;
        
        if (!isClosed) {
            isClosed = true;
        }
        
        emit MarketResolved(_winningOutcomeId, block.timestamp);
    }
    
    // ============ Payout Functions ============
    
    /**
     * @notice Claim payout for winning shares
     */
    function claimPayout() external onlyResolved nonReentrant {
        uint256 winningShares = balanceOf(msg.sender, winningOutcomeId);
        require(winningShares > 0, "No winning shares");
        
        // Calculate payout: winning shares convert 1:1 to outcome value
        // Each winning share = 1 unit of the total pot / total winning shares
        uint256 totalWinningShares = outcomes[winningOutcomeId].totalShares;
        require(totalWinningShares > 0, "No total shares");
        
        uint256 totalPot = address(this).balance;
        uint256 payout = (winningShares * totalPot) / totalWinningShares;
        
        // Deduct platform fee
        uint256 fee = (payout * platformFee) / 10000;
        uint256 netPayout = payout - fee;
        
        // Burn winning shares
        _burn(msg.sender, winningOutcomeId, winningShares);
        
        // Transfer payout
        (bool success, ) = payable(msg.sender).call{value: netPayout}("");
        require(success, "Transfer failed");
        
        // Send fee to factory
        if (fee > 0) {
            (bool feeSuccess, ) = payable(factory).call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        emit PayoutClaimed(msg.sender, netPayout, winningShares);
    }
    
    // ============ Liquidity Functions ============
    
    /**
     * @notice Add liquidity to market (anyone can call)
     */
    function addLiquidity(uint256 outcomeId) external payable beforeExpiry {
        require(outcomeId < totalOutcomes, "Invalid outcome");
        require(msg.value > 0, "Must send ETH");
        
        outcomes[outcomeId].liquidity += msg.value;
        _updatePrice(outcomeId);
        
        emit LiquidityAdded(outcomeId, msg.value);
    }
    
    // ============ View Functions ============
    
    function getOutcome(uint256 outcomeId) external view returns (
        string memory label,
        uint256 totalShares,
        uint256 liquidity,
        uint256 price
    ) {
        require(outcomeId < totalOutcomes, "Invalid outcome");
        Outcome memory outcome = outcomes[outcomeId];
        return (outcome.label, outcome.totalShares, outcome.liquidity, outcome.price);
    }
    
    function getMarketInfo() external view returns (
        string memory,
        uint256,
        uint256,
        bool,
        bool,
        uint256,
        uint256
    ) {
        return (
            question,
            expiryTime,
            totalOutcomes,
            isClosed,
            isResolved,
            winningOutcomeId,
            totalVolume
        );
    }
    
    function getUserPosition(address user, uint256 outcomeId) external view returns (uint256) {
        return balanceOf(user, outcomeId);
    }
    
    // ============ Emergency Functions ============
    
    /**
     * @notice Emergency close by owner (only if oracle fails)
     */
    function emergencyClose() external onlyOwner {
        require(!isClosed, "Already closed");
        isClosed = true;
        emit MarketClosed(block.timestamp);
    }
    
    /**
     * @notice Update oracle address (only before resolution)
     */
    function updateOracle(address newOracle) external onlyOwner {
        require(!isResolved, "Market resolved");
        require(newOracle != address(0), "Invalid oracle");
        oracle = newOracle;
    }
    
    // Override URI function
    function uri(uint256) public pure override returns (string memory) {
        return "";
    }
}
