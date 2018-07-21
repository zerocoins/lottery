const path = require ('path');
const fs = require ('fs');
const solc = require ('solc');

// generate contract's path, load source file from the disk, and call solidity compiler agasint the source like this : solc(surce,1) where 1 referes to a number of contracts to compiler
const lotteryPath = path.resolve (__dirname, 'contracts', 'lottery.sol' );
const source = fs.readFileSync(lotteryPath, 'utf8');
module.exports = solc.compile(source, 1).contracts[':Lottery'];
