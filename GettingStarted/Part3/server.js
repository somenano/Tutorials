const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
require('dotenv').config()

const port = (Number(process.env.PORT) | 3000);
const verbose = Boolean(process.env.VERBOSE);

if (process.env.PIPPIN_WALLET === undefined) {
    console.error('[Alert] You must set your Pippin Wallet ID in the .env file as PIPPIN_WALLET=');
    process.exit(1);
}
if (process.env.NANO_ADDRESS === undefined) {
    console.error('[Alert] You must set your Nano Address in the .env file as NANO_ADDRESS=');
    process.exit(1);
}
if (process.env.FAUCET_PAYOUT === undefined) {
    console.error('[Alert] You must set the faucet payout amount (raw) in the .env file as FAUCET_PAYOUT=');
    process.exit(1);
}
if (process.env.PIPPIN_SERVER === undefined) {
    console.error('[Alert] You must set the Pippin server address in the .env file as PIPPIN_SERVER=');
    process.exit(1);
}

async function pippin_post(params, pippin_server=process.env.PIPPIN_SERVER) {

    if (verbose) {
        console.log('Sending request to pippin-server: '+ pippin_server);
        console.log(params);
    }

    const response = await axios.post(pippin_server, params).catch(console.error);
    if (response === undefined || response.data === undefined) {
        console.error('In pippin_post, did not receive expected data property');
        return {};
    }

    if (verbose) {
        console.log('Received response from pippin-server');
        console.log(response.data);
    }

    return response.data;
}

async function send(destination, id, amount) {
    // amount is in "raw" units
    let params = {
        action: 'send',
        wallet: process.env.PIPPIN_WALLET,
        source: process.env.NANO_ADDRESS,
        destination: destination,
        amount: amount,
        id: id
    }

    let response = await pippin_post(params);
    return response;
}

async function account_balance(address) {
    let params = {
        action: 'account_balance',
        account: address
    }

    let response = await pippin_post(params);
    return response;
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/submit', async function(req, res) {
    let destination = req.query.address;

    if (destination === undefined) {
        return res.json({error: 'You did not provide an address.'});
    }

    /*
     * Here you would do all your additional checks 
     * to ensure no one is abusing the faucet
     */

    // Setting the id will only allow a destination address to be sent to once
    let response = await send(destination, destination, process.env.FAUCET_PAYOUT);
    return res.json(response);
});

app.get('/info', async function(req, res) {
    let balance = await account_balance(process.env.NANO_ADDRESS);
    return res.json({
        faucet_address: process.env.NANO_ADDRESS,
        faucet_balance: balance,
        faucet_payout: process.env.FAUCET_PAYOUT
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})