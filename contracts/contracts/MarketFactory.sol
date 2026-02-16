// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Market} from "./Market.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MarketFactory
 * @notice Factory contract for creating and managing prediction markets
 * @dev Handles market deployment, registry, and admin controls
 */
contract MarketFactory is AccessControl, ReentrancyGuard {
    
    // ============ Role Definitions ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BUILDER_ROLE = keccak256("BUILDER_ROLE");
    
    // ============ State Variables ============
    
    struct MarketMetadata {
        address marketAddress;
        string question;
        string category;
        string[] outcomeLabels;
        uint256 expiryTime;
        uint256 createdAt;
        address creator;
        address oracle;
        bool isActive;
    }
    
    // Market registry
    address[] public allMarkets;
    mapping(address => MarketMetadata) public marketMetadata;
    mapping(string => address[]) public marketsByCategory;
    mapping(address => address[]) public marketsByCreator;
    
    // Configuration
    uint256 public defaultPlatformFee = 200; // 2% in basis points
    uint256 public minExpiryDuration = 1 hours;
    uint256 public maxExpiryDuration = 365 days;
    
    // Fee collection
    uint256 public collectedFees;
    address public feeRecipient;
    
    // ============ Events ============
    
    event MarketCreated(
        address indexed marketAddress,
        string question,
        string category,
        address indexed creator,
        address indexed oracle,
        uint256 expiryTime,
        uint256 timestamp
    );
    
    event MarketDeactivated(
        address indexed marketAddress,
        uint256 timestamp
    );
    
    event PlatformFeeUpdated(
        uint256 oldFee,
        uint256 newFee
    );
    
    event FeeRecipientUpdated(
        address indexed oldRecipient,
        address indexed newRecipient
    );
    
    event FeesWithdrawn(
        address indexed recipient,
        uint256 amount
    );
    
    // ============ Constructor ============
    
    constructor(address _feeRecipient) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        feeRecipient = _feeRecipient;
    }
    
    // ============ Market Creation ============
    
    /**
     * @notice Create a new prediction market
     * @param question The market question
     * @param category Category (politics, sports, crypto, etc.)
     * @param outcomeLabels Array of outcome labels (e.g., ["Yes", "No"])
     * @param expiryTime Unix timestamp when market expires
     * @param oracle Address authorized to resolve the market
     * @return marketAddress Address of the newly created market
     */
    function createMarket(
        string memory question,
        string memory category,
        string[] memory outcomeLabels,
        uint256 expiryTime,
        address oracle
    ) external returns (address marketAddress) {
        // Permission check: either ADMIN or BUILDER role
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(BUILDER_ROLE, msg.sender),
            "Must be admin or builder"
        );
        
        // Validation
        require(bytes(question).length > 0, "Empty question");
        require(bytes(category).length > 0, "Empty category");
        require(outcomeLabels.length >= 2, "Need at least 2 outcomes");
        require(outcomeLabels.length <= 10, "Too many outcomes");
        require(oracle != address(0), "Invalid oracle");
        
        uint256 duration = expiryTime - block.timestamp;
        require(duration >= minExpiryDuration, "Expiry too soon");
        require(duration <= maxExpiryDuration, "Expiry too far");
        
        // Deploy new Market contract
        Market market = new Market(
            question,
            outcomeLabels,
            expiryTime,
            oracle,
            defaultPlatformFee
        );
        
        marketAddress = address(market);
        
        // Store metadata
        marketMetadata[marketAddress] = MarketMetadata({
            marketAddress: marketAddress,
            question: question,
            category: category,
            outcomeLabels: outcomeLabels,
            expiryTime: expiryTime,
            createdAt: block.timestamp,
            creator: msg.sender,
            oracle: oracle,
            isActive: true
        });
        
        // Update registries
        allMarkets.push(marketAddress);
        marketsByCategory[category].push(marketAddress);
        marketsByCreator[msg.sender].push(marketAddress);
        
        emit MarketCreated(
            marketAddress,
            question,
            category,
            msg.sender,
            oracle,
            expiryTime,
            block.timestamp
        );
        
        return marketAddress;
    }
    
    // ============ Market Management ============
    
    /**
     * @notice Deactivate a market (admin only, emergency use)
     */
    function deactivateMarket(address marketAddress) external onlyRole(ADMIN_ROLE) {
        require(marketMetadata[marketAddress].isActive, "Market not active");
        marketMetadata[marketAddress].isActive = false;
        emit MarketDeactivated(marketAddress, block.timestamp);
    }
    
    /**
     * @notice Grant builder role to an address
     */
    function addBuilder(address builder) external onlyRole(ADMIN_ROLE) {
        grantRole(BUILDER_ROLE, builder);
    }
    
    /**
     * @notice Revoke builder role from an address
     */
    function removeBuilder(address builder) external onlyRole(ADMIN_ROLE) {
        revokeRole(BUILDER_ROLE, builder);
    }
    
    // ============ Configuration ============
    
    /**
     * @notice Update platform fee
     */
    function setPlatformFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = defaultPlatformFee;
        defaultPlatformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @notice Update fee recipient
     */
    function setFeeRecipient(address newRecipient) external onlyRole(ADMIN_ROLE) {
        require(newRecipient != address(0), "Invalid recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }
    
    /**
     * @notice Update expiry duration constraints
     */
    function setExpiryConstraints(
        uint256 newMinDuration,
        uint256 newMaxDuration
    ) external onlyRole(ADMIN_ROLE) {
        require(newMinDuration < newMaxDuration, "Invalid range");
        minExpiryDuration = newMinDuration;
        maxExpiryDuration = newMaxDuration;
    }
    
    // ============ Fee Management ============
    
    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(feeRecipient).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FeesWithdrawn(feeRecipient, balance);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get total number of markets
     */
    function getTotalMarkets() external view returns (uint256) {
        return allMarkets.length;
    }
    
    /**
     * @notice Get markets by category
     */
    function getMarketsByCategory(string memory category) external view returns (address[] memory) {
        return marketsByCategory[category];
    }
    
    /**
     * @notice Get markets by creator
     */
    function getMarketsByCreator(address creator) external view returns (address[] memory) {
        return marketsByCreator[creator];
    }
    
    /**
     * @notice Get market metadata
     */
    function getMarketMetadata(address marketAddress) external view returns (
        string memory question,
        string memory category,
        string[] memory outcomeLabels,
        uint256 expiryTime,
        uint256 createdAt,
        address creator,
        address oracle,
        bool isActive
    ) {
        MarketMetadata memory metadata = marketMetadata[marketAddress];
        return (
            metadata.question,
            metadata.category,
            metadata.outcomeLabels,
            metadata.expiryTime,
            metadata.createdAt,
            metadata.creator,
            metadata.oracle,
            metadata.isActive
        );
    }
    
    /**
     * @notice Get active markets (paginated)
     */
    function getActiveMarkets(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        uint256 total = allMarkets.length;
        if (offset >= total) {
            return new address[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        uint256 resultCount = 0;
        for (uint256 i = offset; i < end; i++) {
            if (marketMetadata[allMarkets[i]].isActive) {
                resultCount++;
            }
        }
        
        address[] memory result = new address[](resultCount);
        uint256 index = 0;
        for (uint256 i = offset; i < end; i++) {
            if (marketMetadata[allMarkets[i]].isActive) {
                result[index] = allMarkets[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @notice Check if address is a builder
     */
    function isBuilder(address account) external view returns (bool) {
        return hasRole(BUILDER_ROLE, account);
    }
    
    /**
     * @notice Check if address is an admin
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
    
    // ============ Receive ETH ============
    
    receive() external payable {
        collectedFees += msg.value;
    }
}
