// truffle hdwallet provider does two things: a) it is a network provider for infure b) it unlocks the account with mnemonic for deploying

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require ('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  'spell jungle inspire width endorse tray deposit option other pact shell excess',
  'https://rinkeby.infura.io/N9dfn4zO2DKYq9WOwE9V' // URI of ethereum client to send non-transaction related ewb3 requests
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attemping to deploy from account ',accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))  // json parse will create java script object from json file (the abi interface gotten by compiling the contract sol source)
    .deploy({ data: '0x' + bytecode }) // deploy
    .send({ from: accounts[0], gas: '1000000' }); // and send
  console.log('Contract deployed at the address ', result.options.address);
};

deploy();
