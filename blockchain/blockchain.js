class Block {
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
  }

  static calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, "0", Date.now(), "Genesis block", Block.calculateHash(0, "0", Date.now(), "Genesis block"));
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = Block.calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data);
    while (newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
      newBlock.nonce++;
      newBlock.hash = Block.calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data + newBlock.nonce);
    }
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== Block.calculateHash(currentBlock.index, previousBlock.hash, currentBlock.timestamp, currentBlock.data)) {
        return false;
      }
    }
    return true;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Wallet {
  constructor() {
    this.balance = 0;
    this.address = this.generateAddress();
  }

  generateAddress() {
    return CryptoJS.SHA256(Math.random().toString()).toString();
  }

  sendTransaction(toAddress, amount) {
    if (this.balance >= amount) {
      const transaction = new Transaction(this.address, toAddress, amount);
      // Add transaction to blockchain
      this.balance -= amount;
      return transaction;
    } else {
      throw new Error("Insufficient funds");
    }
  }
}

const blockchain = new Blockchain();
const wallet = new Wallet();

// Add transactions to blockchain
const transaction1 = wallet.sendTransaction("address1", 100);
const transaction2 = wallet.sendTransaction("address2", 50);
blockchain.addBlock(new Block(blockchain.chain.length, blockchain.getLatestBlock().hash, Date.now(), [transaction1, transaction2]));

// Verify blockchain
console.log(blockchain.isChainValid());
