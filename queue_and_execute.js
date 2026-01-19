const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./dao_config.json");

async function main() {
    const governor = await ethers.getContractAt("MyGovernor", config.governor);
    const box = await ethers.getContractAt("Box", config.box);
    const proposalId = fs.readFileSync("proposal_id.txt", "utf8");

    const NEW_VALUE = 77;
    const description = "Proposal #1: Store 77 in Box";
    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(description));
    const encodedFunction = box.interface.encodeFunctionData("store", [NEW_VALUE]);

    // 1. Queue
    console.log("Queueing Proposal...");
    // Fast forward voting period
    // await ethers.provider.send("evm_increaseTime", [50401]); 
    // await ethers.provider.send("evm_mine");

    await governor.queue(
        [config.box],
        [0],
        [encodedFunction],
        descriptionHash
    );

    console.log("Queued! Waiting for TimeLock delay...");

    // 2. Execute
    // Fast forward TimeLock delay (3600 seconds)
    // await ethers.provider.send("evm_increaseTime", [3601]);
    // await ethers.provider.send("evm_mine");

    await governor.execute(
        [config.box],
        [0],
        [encodedFunction],
        descriptionHash
    );

    console.log("Executed!");
    
    // Check Result
    const val = await box.value();
    console.log(`Box Value is now: ${val} (Should be 77)`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
