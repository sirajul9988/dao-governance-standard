const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    // 1. Deploy Token
    const Token = await ethers.getContractFactory("GovToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    // Delegate to self so we can vote
    await token.delegate(deployer.address);
    console.log("Token Deployed & Delegated");

    // 2. Deploy TimeLock (Min Delay: 1 hour)
    const minDelay = 3600; 
    const TimeLock = await ethers.getContractFactory("TimeLock");
    // Proposers/Executors empty for now, we set them after Governor deployment
    const timelock = await TimeLock.deploy(minDelay, [], [], deployer.address);
    await timelock.waitForDeployment();
    const timelockAddr = await timelock.getAddress();

    // 3. Deploy Governor
    const Governor = await ethers.getContractFactory("MyGovernor");
    const governor = await Governor.deploy(tokenAddr, timelockAddr);
    await governor.waitForDeployment();
    const govAddr = await governor.getAddress();

    // 4. Setup Roles
    // Timelock Admin Role
    const adminRole = await timelock.DEFAULT_ADMIN_ROLE();
    const proposerRole = await timelock.PROPOSER_ROLE();
    const executorRole = await timelock.EXECUTOR_ROLE();

    // Governor can propose
    await timelock.grantRole(proposerRole, govAddr);
    // Anyone can execute
    await timelock.grantRole(executorRole, ethers.ZeroAddress);
    // Revoke deployer admin so only DAO controls TimeLock
    await timelock.revokeRole(adminRole, deployer.address);

    // 5. Deploy Box and transfer ownership to TimeLock
    const Box = await ethers.getContractFactory("Box");
    const box = await Box.deploy();
    await box.waitForDeployment();
    await box.transferOwnership(timelockAddr);

    // Save Config
    const config = { token: tokenAddr, timelock: timelockAddr, governor: govAddr, box: await box.getAddress() };
    fs.writeFileSync("dao_config.json", JSON.stringify(config));
    console.log("DAO Deployed!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
