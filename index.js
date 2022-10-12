const fs = require('fs');
const solana = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');

// reading the wallets file and splitting as well as reading for each line
fs.readFileSync('./wallets.csv', 'utf8').split('\n').forEach(line => {
    if (line.startsWith('Wallet')) return; // ignores the first line with the context Wallet
    const [name, privKey] = line.split(','); // splits the line into the name and private key
    const privKeyUint8Array = new Uint8Array(bs58.decode(privKey)).slice(0, 32); // converts the private key to a Uint8Array and slices it to 32 bytes
    const keypair = solana.Keypair.fromSeed(privKeyUint8Array);
    // makes the request to the metaplex api
    axios.get('https://claim.metaplex.com/api/' + keypair.publicKey.toString()) 
    .then(function (resp) {
        if (resp.data.collector.amount) {
        // logs the wallet name and amount of MPLX
         console.log(name + ' has ' + resp.data.collector.amount / 1e6 + ' MPLX'); 
        }
    })
    .catch(function (err) {
        // error = no amount available to be claimed for this address so we log no mplx
        console.log(name + ' has no MPLX');
    });
});
