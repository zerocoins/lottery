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
let manager;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: manager, gas: '1000000'});
});

describe('Lottery Contract tests', () => {
  it('Contract should get deployed', () => {
    assert.ok(lottery.options.address);
  });

  it('One account should enter the lottery', async () => {
    await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('1.5','ether')});
    var players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[0], players[0]); // first you specifiy the expected value
    assert.equal(1, players.length); // expected than actual value to compare
  });

  it('Multiple accounts should enter the lottery', async () => {
    for (i = 0; i < accounts.length; i++) {
      await lottery.methods.enter().send({ from: accounts[i], value: web3.utils.toWei(i.toString() + 1,'ether')});
    }

    var players = await lottery.methods.getPlayers().call();
    for (i = 0; i < accounts.length; i++) {
      assert.equal(accounts[i], players[i]); // first you specifiy the expected value
    }

    assert.equal(accounts.length, players.length); // expected than actual value to compare
  });

  it('Requires a minimum ammount of ether', async () => {
    let error = false;
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02','ether')
      });
    }
    catch (err) {
      error = true;
    }
    finally
    {
      assert.ok(error); // assert ok checks for truthness while just assert
    }
  });

  it('Only manager can pickWinner', async () => {
    try {
      // at least one should enter lottery
      await lottery.methods.pickWinner().send({
        from: accounts[1] // this is not a manager so exception should be thrown
      });
      assert(false);
    }
    catch (err) {
      assert(true);
    }
  });

  it ('sends money and resets players', async () => {
    let account = accounts[0];
    await lottery.methods.enter().send({ from: account, value: web3.utils.toWei('2','ether')});
    const initialBalance = await web3.eth.getBalance(account);
    await lottery.methods.pickWinner().send({from: account});
    // new balance = initialBalance - transaction cost
    const finalBalance = await web3.eth.getBalance(account);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8','ether'));
    assert.equal(0, lottery.methods.players.length);
    var playersCount = await lottery.methods.getPlayers().call();
    assert.equal(0, playersCount);
    contractBalance = await web3.eth.getBalance(lottery.options.address);
    assert.equal(0, contractBalance);
  });
});
