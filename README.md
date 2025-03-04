# **Liquid Staking Smart Contracts**

This project implements a **Liquid Staking Protocol** using **Hardhat** and **Solidity**. The protocol allows users to:

- Stake **BaseTokens** and receive **StakingTokens** as a representation of their stake.
- Unstake by burning **StakingTokens** to redeem **BaseTokens** with rewards.
- Earn additional rewards that dynamically adjust the exchange rate.

## **🛠️ Project Setup**

### **Configure Environment Variables**

Create a `.env` file in the root directory and add:

```ini
INFURA_API_KEY=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key
```

## **🚀 Deployment**

### **Start a Local Blockchain**

```sh
npx hardhat node
```

### **Deploy Contracts**

```sh
npm run deploy
```

### **Or deploy to a testnet:**

```sh
npm run deploy --network goerli
```

## **🧪 Running Tests**

```sh
npx hardhat test
```

### **With gas reporting:**

```sh
npx hardhat test --gas-reporter
```

## **📜 Available Commands**

```sh
npm run clean     # Remove cache and compiled artifacts
npm run compile   # Compile smart contracts
npm run test      # Run unit tests
npm run rebuild   # Clean, compile, and test in sequence
npx hardhat node  # Start a local Hardhat blockchain
npx hardhat help  # List available Hardhat tasks
```

## **📂 Project Structure**

```bash
📂 liquid-staking
 ┣ 📂 contracts          # Solidity smart contracts
 ┃ ┣ 📜 StakingToken.sol # ERC-20 staking token contract
 ┃ ┗ 📜 LiquidStaking.sol # Liquid staking contract
 ┣ 📂 scripts            # Deployment scripts
 ┃ ┗ 📜 deploy.ts        # Deploys contracts to the network
 ┣ 📂 test               # Unit tests
 ┃ ┗ 📜 staking.test.ts  # Tests for staking contract
 ┣ 📜 hardhat.config.ts  # Hardhat configuration file
 ┗ 📜 README.md          # Project documentation
```

## **📌 TODO List**

✅ Implement StakingToken (ERC-20)

✅ Implement LiquidStaking contract

✅ Deploy contracts to a testnet

🟡 Integrate frontend interface

**📩 Contact**

### **If you have any questions, feel free to reach out! 🚀**

email: [vladyslaw.larin@gmai.com](mailto\:vladyslaw.larin@gmai.com)

