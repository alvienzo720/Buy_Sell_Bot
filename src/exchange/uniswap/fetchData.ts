const ethers = require("ethers")


async function fetchTransactions() {
    const provider = new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/68961d62789e403aa86ee13a2d6406b0`)
    try {
        provider.on('pending', async (tx: any) => {
            const txtInfo = await provider.getTransaction(tx)
            if (txtInfo) {
                console.log("Transaction Hash", txtInfo.hash)
                console.log("From", txtInfo.from)
                console.log("To", txtInfo.to)
                console.log("Value", txtInfo.value)
                console.log("Gas Price", txtInfo.gasPrice)
                console.log("Time Stamo", txtInfo.timestamp)
                console.log("--------------------------------------------------------------------------")
            } else {
                console.error(`Transaction info for hash "${tx}" not found`)
            }
        })
    } catch (error) {
        console.error("An error occurred:", error)
    }
}

fetchTransactions()
