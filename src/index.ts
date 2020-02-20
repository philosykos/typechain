import * as CryptoJS from "crypto-js";

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}
const calculateBlockHash = (
    index: number,
    previousHash: string,
    data: string,
    timestamp: number
): string =>
    CryptoJS.SHA256(index + previousHash, data, timestamp).toString();

const validateStructure = (aBlock: Block): boolean =>
  typeof aBlock.index === "number" &&
  typeof aBlock.hash === "string" &&
  typeof aBlock.previousHash === "string" &&
  typeof aBlock.timestamp === "number" &&
  typeof aBlock.data === "string";

const timestamp: number = + new Date("2009-01-04 03:15");
const data: string = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";
const blockHash: string = CryptoJS.SHA256(0 + "" + timestamp + data).toString();
const genesisBlock:Block = new Block(0, blockHash, "", data, timestamp);

let blockchain: Block[] = [genesisBlock];
const getBlockchain = (): Block[] => blockchain;
const getLatestBlock= (): Block => blockchain[blockchain.length - 1];
const getNewTimeStamp= (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const index: number = previousBlock.index + 1;
  const timestamp: number = getNewTimeStamp();
  const hash: string = calculateBlockHash(index, previousBlock.hash, data, timestamp);
  const newBlock: Block = new Block(index, hash, previousBlock.hash, data, timestamp);
  addBlock(newBlock);
  return newBlock;
};

const getHashFromBlock = (aBlock: Block): string => calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.data, aBlock.timestamp);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if(!validateStructure(candidateBlock)) {
    return false;
  } else if(previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if(previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if(getHashFromBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if(isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
