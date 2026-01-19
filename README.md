# DAO Governance Standard

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![OpenZeppelin](https://img.shields.io/badge/Governor-Compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

**DAO Governance Standard** allows a community to upgrade smart contracts or move treasury funds trustlessly.

* **GovToken**: An ERC-20 token with snapshot and delegation capabilities (`ERC20Votes`).
* **Governor**: Manages proposals, voting periods, and quorum checks.
* **TimeLock**: The owner of the system. It enforces a delay (e.g., 2 days) between passing a vote and executing code, giving users time to exit if they disagree.

## Workflow

1.  **Delegate**: Token holders must `delegate()` voting power to activate it.
2.  **Propose**: Create a proposal to call a function (e.g., `store(77)` on Box contract).
3.  **Vote**: Community votes "For", "Against", or "Abstain".
4.  **Queue**: If successful, the proposal enters the TimeLock.
5.  **Execute**: After the delay, the code runs automatically.

## Usage

```bash
# 1. Install
npm install

# 2. Deploy DAO Stack
npx hardhat run deploy.js --network localhost

# 3. Create a Proposal (Change value to 77)
node propose.js

# 4. Cast Vote
node vote.js

# 5. Queue & Execute (Simulating time travel)
node queue_and_execute.js
