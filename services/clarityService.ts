
import {
  AppConfig,
  UserSession,
  showConnect,
} from '@stacks/connect';
import {
  uintCV,
  makeContractCall,
  standardPrincipalCV,
  ClarityValue,
} from '@stacks/transactions';

// === SIMULATION CONSTANTS ===
const APP_NAME = 'EduChain Quest';
const APP_ICON = window.location.origin + '/favicon.svg';
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // A real but irrelevant address for simulation
const CONTRACT_NAME = 'staking-contract';
const MOCK_USER_PRINCIPAL = 'ST2JHG361ZXG51QTKY2NQCVBP4S91ZDB2M59942R4'; // Simulated user address
const REWARD_RATE_PER_SECOND = 0.0005; // 0.05% per second

// === SIMULATION STATE ===
// This object simulates the on-chain state of our contract.
let mockChainState = {
  stakedBalances: new Map<string, { amount: number, timestamp: number }>(),
  rewardBalances: new Map<string, number>(),
  lastUpdateTime: Date.now(),
};

// === SIMULATION HELPERS ===

/**
 * Updates the rewards for all stakers based on time passed.
 * This simulates a process that would happen on-chain or be calculated by the contract.
 */
function updateRewards() {
    const now = Date.now();
    const secondsPassed = (now - mockChainState.lastUpdateTime) / 1000;

    if (secondsPassed < 1) return;

    for (const [principal, stakeInfo] of mockChainState.stakedBalances.entries()) {
        const reward = stakeInfo.amount * REWARD_RATE_PER_SECOND * secondsPassed;
        const currentRewards = mockChainState.rewardBalances.get(principal) || 0;
        mockChainState.rewardBalances.set(principal, currentRewards + reward);
    }
    
    mockChainState.lastUpdateTime = now;
}

/**
 * Simulates a delay to mimic network latency.
 */
const networkDelay = (ms: number = 800) => new Promise(res => setTimeout(res, ms));


// === SERVICE INTERFACE (simulates @stacks/connect and @stacks/transactions) ===

let userSession: UserSession;

export async function connectWallet() {
  const appConfig = new AppConfig([ 'store_write' ]);
  userSession = new UserSession({ appConfig });
  
  // In a real app, this would open a popup. Here, we just simulate a successful connection.
  console.log("Simulating wallet connection popup...");
  await networkDelay(1000);
  console.log("Wallet connected successfully!");
  
  // Initialize mock state for the new user
  if (!mockChainState.stakedBalances.has(MOCK_USER_PRINCIPAL)) {
      mockChainState.stakedBalances.set(MOCK_USER_PRINCIPAL, { amount: 0, timestamp: Date.now() });
      mockChainState.rewardBalances.set(MOCK_USER_PRINCIPAL, 0);
  }
}

export async function stakeTokens(amount: number) {
    console.log(`Simulating 'stake' contract call with amount: ${amount}`);
    await networkDelay();
    updateRewards();
    
    const stakeInfo = mockChainState.stakedBalances.get(MOCK_USER_PRINCIPAL)!;
    stakeInfo.amount += amount;
    stakeInfo.timestamp = Date.now();
    
    console.log("Stake successful. New staked balance:", stakeInfo.amount);
    return Promise.resolve();
}


export async function unstakeTokens(amount: number) {
    console.log(`Simulating 'unstake' contract call with amount: ${amount}`);
    updateRewards();

    const stakeInfo = mockChainState.stakedBalances.get(MOCK_USER_PRINCIPAL)!;
    if (amount > stakeInfo.amount) {
        throw new Error("Simulated Error: Insufficient staked balance.");
    }
    await networkDelay();
    
    stakeInfo.amount -= amount;
    stakeInfo.timestamp = Date.now();
    
    console.log("Unstake successful. New staked balance:", stakeInfo.amount);
    return Promise.resolve();
}


export async function claimRewards(): Promise<number> {
    console.log("Simulating 'claim-rewards' contract call...");
    updateRewards();
    
    const rewards = mockChainState.rewardBalances.get(MOCK_USER_PRINCIPAL) || 0;
    if (rewards <= 0) {
      console.log("No rewards to claim.");
      return 0;
    }

    await networkDelay();
    mockChainState.rewardBalances.set(MOCK_USER_PRINCIPAL, 0);
    
    console.log(`Claimed ${rewards} tokens successfully.`);
    return Promise.resolve(rewards);
}


export async function fetchStakedBalance(): Promise<number> {
    console.log("Simulating read-only call for staked balance...");
    updateRewards();
    await networkDelay(300);
    const balance = mockChainState.stakedBalances.get(MOCK_USER_PRINCIPAL)?.amount || 0;
    return Promise.resolve(balance);
}


export async function fetchRewardBalance(): Promise<number> {
    console.log("Simulating read-only call for reward balance...");
    updateRewards();
    await networkDelay(300);
    const rewards = mockChainState.rewardBalances.get(MOCK_USER_PRINCIPAL) || 0;
    return Promise.resolve(rewards);
}