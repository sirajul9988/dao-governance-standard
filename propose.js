const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./dao_config.json");

async function main() {
    const governor = await ethers.getContractAt("MyGovernor", config.governor);
    const box = await ethers.getContractAt("Box", config.box);

    const NEW_VALUE = 77;
    const description = "Proposal #1: Store 77 in Box";
    
    // Encoded function call
    const encodedFunction = box.interface.encodeFunctionData("store", [NEW_VALUE]);

    console.log("Submitting Proposal...");
    
    const tx = await governor.propose(
        [config.box], // Targets
        [0], // Values (ETH)
        [encodedFunction], // Calldatas
        description
    );
    const receipt = await tx.wait();

    // Get Proposal ID from events
    // In Hardhat local, it's usually deterministic. 
    // For this script, we assume we need to fetch it from the logs or calculate hash.
    // Simplified: We calculate the ID manually
    const id = await governor.hashProposal(
        [config.box],
        [0],
        [encodedFunction],
        ethers.keccak256(ethers.toUtf8Bytes(description))
    );

    console.log(`Proposal Created! ID: ${id}`);
    
    // Save ID for next steps
    fs.writeFileSync("proposal_id.txt", id.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
