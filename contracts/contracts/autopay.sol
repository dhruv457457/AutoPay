// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubscriptionManager {

    struct Subscription {
        uint256 id;
        address owner;      // NEW: The user's EOA (main wallet) address
        address subscriber; // The user's Smart Account address
        address recipient;
        address token;
        uint256 amount;
        uint256 frequency;
        uint256 lastPaymentTimestamp;
        bool isActive;
    }

    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public subscriptionsByAddress;
    uint256 private _nextSubscriptionId;

    // UPDATED: Event now includes the owner's EOA
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed owner,
        address indexed subscriber,
        address recipient, // Made this non-indexed to avoid compiler issues
        address token,
        uint256 amount,
        uint256 frequency
    );

    event SubscriptionCancelled(
        uint256 indexed subscriptionId,
        address indexed subscriber
    );

    event PaymentMade(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 amount,
        uint256 paymentTimestamp
    );

    // UPDATED: Function now accepts the owner's EOA
    function createSubscription(
        address _owner, // NEW: The user's EOA address
        address _recipient,
        address _token,
        uint256 _amount,
        uint256 _frequency
    ) external returns (uint256) {
        require(_owner != address(0), "Owner cannot be zero address");
        require(_recipient != address(0), "Recipient cannot be zero address");
        require(_token != address(0), "Token cannot be zero address");
        require(_amount > 0, "Amount must be greater than zero");
        require(_frequency > 0, "Frequency must be greater than zero");

        uint256 subscriptionId = _nextSubscriptionId;
        
        subscriptions[subscriptionId] = Subscription({
            id: subscriptionId,
            owner: _owner,              // NEW: Store the owner EOA
            subscriber: msg.sender,     // This is the Smart Account address
            recipient: _recipient,
            token: _token,
            amount: _amount,
            frequency: _frequency,
            lastPaymentTimestamp: block.timestamp,
            isActive: true
        });

        // This still maps by the Smart Account address for the frontend to easily find subscriptions
        subscriptionsByAddress[msg.sender].push(subscriptionId);

        // UPDATED: Emit the new owner field
        emit SubscriptionCreated(
            subscriptionId,
            _owner,
            msg.sender,
            _recipient,
            _token,
            _amount,
            _frequency
        );

        _nextSubscriptionId++;
        return subscriptionId;
    }

    function cancelSubscription(uint256 _subscriptionId) external {
        Subscription storage sub = subscriptions[_subscriptionId];
        // Security check remains the same: only the Smart Account can cancel
        require(sub.subscriber == msg.sender, "Only subscriber can cancel");
        require(sub.isActive, "Subscription already cancelled");

        sub.isActive = false;

        emit SubscriptionCancelled(_subscriptionId, msg.sender);
    }

    function executePayment(uint256 _subscriptionId) external {
        Subscription storage sub = subscriptions[_subscriptionId];

        require(sub.subscriber != address(0), "Subscription does not exist");
        require(sub.isActive, "Subscription is not active");
        require(block.timestamp >= sub.lastPaymentTimestamp + sub.frequency, "Payment not due yet");
        
        // The msg.sender will be the user's Smart Account, which is the 'subscriber'
        address subscriber = sub.subscriber;
        
        sub.lastPaymentTimestamp = block.timestamp;
        
        emit PaymentMade(
            _subscriptionId,
            subscriber,
            sub.amount,
            block.timestamp
        );

        // The Smart Account (`msg.sender`) pulls tokens from itself to pay the recipient.
        IERC20(sub.token).transferFrom(msg.sender, sub.recipient, sub.amount);
    }

    function getSubscription(uint256 _subscriptionId) external view returns (Subscription memory) {
        return subscriptions[_subscriptionId];
    }

    function getSubscriptionsForUser(address _user) external view returns (uint256[] memory) {
        // This function returns subscriptions for a given Smart Account address
        return subscriptionsByAddress[_user];
    }
}