const assert = require('assert');  // assertion librarty from mocha
const ganache = require ('ganache-cli'); // ganache will make local test network
const Web3 = require ('web3'); // uses ABI to communicate with the ethereum network over JSON RPC protocol
const {bytecode, interface} = require ('../compile'); // abi of contract and raw compiled contract, from compile file


// web3 is an instance of Web3 and we are connecting to ganache hense we use ganache connection provider
const provider = ganache.provider();
const web3  = new Web3(provider);

let lottery; // lottery contract instance after being deployed
let accounts; // ganache accounts we are going to use for deploying contract and sending
// transactions from

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract tests', () => {

  it('Contract should get deployed', () => {
    assert.ok(lottery.options.address);
  });
});
