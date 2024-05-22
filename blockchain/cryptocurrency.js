class Cryptocurrency {
  constructor (name, symbol, totalSupply, blockReward, difficulty) {
    this.name = name
    this.symbol = symbol
    this.totalSupply = totalSupply
    this.blockReward = blockReward
    this.difficulty = difficulty

    this.blockchain = [this.createGenesisBlock()]
    this.pendingTransactions = []
    this.miningRewardAddress = '0x0000000000000000000000000000000000000000'
  }

  createGenesisBlock () {
    return new Block(0, '0', Date.now(), [], '0')
  }

  generateHash (index, previousHash, timestamp, data, nonce) {
    return CryptoJS.SHA256(
      index + previousHash + timestamp + data + nonce
    ).toString()
  }

  minePendingTransactions (miningRewardAddress) {
    const block = new Block(
      this.blockchain.length,
      this.blockchain[this.blockchain.length - 1].hash,
      Date.now(),
      this.pendingTransactions
    )
    block.mineBlock(this.difficulty)
    this.blockchain.push(block)
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.blockReward)
    ]
  }

  createTransaction (transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress (address) {
    let balance = 0
    for (let i = 0; i < this.blockchain.length; i++) {
      for (let j = 0; j < this.blockchain[i].transactions.length; j++) {
        if (this.blockchain[i].transactions[j].fromAddress === address) {
          balance -= this.blockchain[i].transactions[j].amount
        }
        if (this.blockchain[i].transactions[j].toAddress === address) {
          balance += this.blockchain[i].transactions[j].amount
        }
      }
    }
    return balance
  }

  isChainValid () {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i]
      const previousBlock = this.blockchain[i - 1]

      if (
        currentBlock.hash !==
        this.generateHash(
          currentBlock.index,
          previousBlock.hash,
          currentBlock.timestamp,
          currentBlock.transactions,
          currentBlock.nonce
        )
      ) {
        return false
      }
    }
    return true
  }
}

class Block {
  constructor (index, previousHash, timestamp, transactions, hash, nonce) {
    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.transactions = transactions
    this.hash = hash
    this.nonce = nonce
  }

  mineBlock (difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++
      this.hash = Cryptocurrency.generateHash(
        this.index,
        this.previousHash,
        this.timestamp,
        this.transactions,
        this.nonce
      )
    }
  }
}

class Transaction {
  constructor (fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}
