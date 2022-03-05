const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256");

let whitelistAddress = [
"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
"0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
"0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
"0x90f79bf6eb2c4f870365e785982e1f101e93b906"
]

function getProof  (_address)  {
    
    const leafNodes = whitelistAddress.map(addr =>  keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes,keccak256,{sortPairs: true});
    
    const claimingAddress = keccak256(_address);
    const hexProof = merkleTree.getHexProof(claimingAddress);
    return hexProof;
}

export default getProof;
