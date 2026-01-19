const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./dao_config.json");

async function main() {
    const governor = await ethers.getContractAt("MyGovernor", config.governor);
    const proposalId = fs.readFileSync("proposal_id.txt", "utf8");

    // Wait for Voting Delay (1 block)
    // await ethers.provider.send("evm_mine");

    console.log("Casting Vote (1 = For)...");
    
    // 0 = Against, 1 = For, 2 = Abstain
    const tx = await governor.castVote(proposalId, 1);
    await tx.wait();

    console.log("Voted!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
