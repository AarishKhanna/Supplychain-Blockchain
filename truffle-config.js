const path = require("path");
require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
//INFURA_API_KEY="270ed914188d488db6e6e1ee13c026b4"

//const mnemonic = 'process.env.MNEMONIC'
//const rpc_url = `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: () => 
        new HDWalletProvider(
          process.env.MNEMONIC,
          'https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}'
        ),
        network_id: 3,       // Ropsten's id
        gas: 5500000,        // Ropsten has a lower block limit than mainnet
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
   
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 
      'https://rinkeby.infura.io/v3/88e88d96c21244038d247be962b03b9c'),
       host: "127.0.0.1", 
       network_id: 4,
       gas: 4612388,
       gasPrice: 10000000000
   },
    
} , 
  compilers: {
    solc: {
      version: "0.8.9"
    }
  }
};