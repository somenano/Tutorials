var express = require('express');
var router = express.Router();
var request = require('request');

var wallet_pass = 'your_password';
var snapy_key = 'pub_your-snapy-key';

/*
    // Setup a webhook following the Snapy.io documentation
    // https://snapy.io/docs#webhooks
    // Example: curl https://snapy.io/api/v1/webhooks/address -H "x-api-key: pub_1234..." -H "Content-Type: application/json" -d '{"address":"xrb_3abcd...", "url": "https://your-heroku-app-name.herokuapp.com/new_block", "confirmations": 1}' -X POST

    Sample fullBlock = {
        "hash":"639983283F3EC39290D23312DCAA5A44D04CB699466F9CA1853AF36208FA02C3",
        "address":"xrb_3pag75gcfcny69zotqij8b6jmcbo8hozcogbyqwuuy9spg5kisocowicx9e4",
        "confirmationNo": 1,
        "sender": "nano_1nanoteiu8euwzrgqnn79c1fhpkeuzi4b4ptogoserckbxkw15dma6dg5hb5",
        "amount":10000,
    }
*/

/* POST new block */
router.post('/', async function(req, res, next) {

    res.sendStatus(200);

    const fullBlock = req.body;

    console.log("New Block Received!");
    console.log(fullBlock);

    // Send transaction back to where it came from
    var options = {
        url: 'https://snapy.io/api/v1/send',
        headers: {
            'x-api-key': snapy_key,
            'Content-type': 'Application/json'
        },
        method: 'post',
        body: {
            "to": fullBlock.sender,
            "from": fullBlock.address,
            "amount": fullBlock.amount,
            "password": wallet_pass
        },
        json: true
    }

    await new Promise((resolve, reject) => {
        request(options, function(err, res, body) {
            if (err) {
                console.error('error sending transaction: ', err);
                resolve(false);
            }
            var answer = body;

            if (answer.status != "success") {
                console.error('send transaction did not return success!');
                console.error(answer);
                resolve(false);
            }

            console.log('SUCCESSFUL SEND');
            console.log(answer);
            resolve(true);
        });
    });

});

module.exports = router;
