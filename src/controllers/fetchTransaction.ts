import ethers from 'ethers';
import { UniswapABI } from '../config';
const provider = new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/68961d62789e403aa86ee13a2d6406b0`)

async function getTransactions() {
    // Get the latest block number
    const blockNumber = await provider.getBlockNumber();

    // Get the transactions in the latest block
    const block = await provider.getBlock(blockNumber);
    const transactions = block.transactions;

    // Decode the transactions to get the input methods
    for (const transaction of transactions) {
        const transactionReceipt = await provider.getTransactionReceipt(transaction);
        const contractAddress = transactionReceipt.contractAddress;
        if (contractAddress) {
            // call decode transaction function here
            decodeTransaction(contractAddress)
        }
    }
}

async function decodeTransaction(transactionHash: any | Promise<any>) {
    const transaction = await provider.getTransaction(transactionHash);
    const contract = new ethers.Contract(transaction.to, UniswapABI, provider);
    const decodedData = contract.interface.decodeTransactionData(transaction.data);
    console.log(decodedData);
    // filter transactions
    if (decodedData.name === 'addLiquidity') {
        console.log(decodedData);
    }
}

getTransactions();