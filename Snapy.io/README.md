| :warning: CAUTION          |
|:---------------------------|
| The Snapy.io API still exists, however, I have heard MANY people complain about its availability and lack of support. As of January 2021 I no longer use Snapy.io in any of my projects and I do not endorse its use. As with all crypto projects, make your own risk assessment to decide if you should build a dependency on someone else's project. That said, I am keeping this tutorial online.|

# Snapy.io Node.js Demonstration

This is a simple demonstration of how you can integrate [Snapy.io](https://snapy.io) into a Node.js app.  This demonstration will receive a [Nano](https://nano.org) transaction and then immediately send it back.  Nano has zero fees, so this demonstration can be run as often as you like.

## Getting Started

This codebase was created using `express --view=pug`.  Then app.js was modified to include the routes/blocks.js router.  No other files were changed.

### Step 1. Clone this repository

Run the following: `git clone https://github.com/somenano/Tutorials`

Also, make sure while in the Snapy.io directory, run `npm install` to install all the node_modules dependencies.

### Step 2. Setup your Snapy.io account

Go to [Snapy.io](https://snapy.io) and create an account.  You will need to keep a copy of your key.

### Step 3. Generate a Nano wallet

Official documentation here: [https://snapy.io/docs#createwallet](https://snapy.io/docs#createwallet)

Substitute your key and choose a strong password, then run this command: `curl https://snapy.io/api/v1/wallets -H "x-api-key: <pub_snapy-key>" -H "Content-Type: application/json" -d "{\"password\":\"wallet_password\"}"`

### Step 4. Generate a Nano address

Official documentation here: [https://snapy.io/docs#generateaddresses](https://snapy.io/docs#generateaddresses)

Substitute your key, then run this command: `curl https://snapy.io/api/v1/address -H "x-api-key: <pub_snapy-key>" -X POST`

### Step 5. Update codebase with key and password

In routes/blocks.js, set the appropriate values to the variables `wallet_pass` and `snapy_key`.

### Step 6. Subscribe to the webhook

Official documentation here: [https://snapy.io/docs#webhooks](https://snapy.io/docs#webhooks)

Substitute your key, then run this command: `curl https://snapy.io/api/v1/webhooks/address -H "x-api-key: <pub_snapy-key>" -H "Content-Type: application/json" -d "{\"address\":\"xrb_1youraccount\", \"url\": \"https://your-heroku-app-name.herokuapp.com/new_block\", \"confirmations\": 1}" -X POST`

### Step 7. Run your app

I like using [Heroku](https://heroku.com) to test Node.js apps.

#### Step 7a. Create a Heroku account and app

Visit [https://heroku.com](https://heroku.com) and create your account.  Create an app and download the heroku client.  Then you can run `heroku login` in your console to be fully authenticated with your Heroku account.

#### Step 7b. Push your app to Heroku

```
git init
heroku git:clone -a somenano-test
git add .
git commit -m "Nano ROCKS! (or other appropriate commit message)"
git push heroku master
```

#### Step 7c. Watch Heroku logs

Run this command: `heroku logs --tail`

### Step 8. Send Nano!

You can create a qrcode of your Snapy.io Nano account for easier sending [here](https://cwaqrgen.com/nano).  After you send the Nano, if all goes as planned, you will see your Heroku logs display the received and sent transaction.  And you will get your Nano transaction back in your wallet.

Here is a sample of the log I receive on Heroku:

```
2019-10-29T02:46:23.73314+00:00 app[web.1]: New Block Received!
2019-10-29T02:46:23.736426+00:00 app[web.1]: {
2019-10-29T02:46:23.73643+00:00 app[web.1]: hash: 'DB3C0B96EDB1C3E284BF09493471F973535386317D1B82669FCE0952987153AA',
2019-10-29T02:46:23.736432+00:00 app[web.1]: confirmationNo: 1,
2019-10-29T02:46:23.736434+00:00 app[web.1]: address: 'xrb_3mrsytz6dxajoahkyt4btcany7pmrmojok6gh54e36hhnezqn95prbip6p3h',
2019-10-29T02:46:23.736436+00:00 app[web.1]: sender: 'nano_1mso6d9hrcrp8acgtxiykbjc9knnibjcntfsdnb7437ssuupw1medkgwpdq6',
2019-10-29T02:46:23.736438+00:00 app[web.1]: amount: 10000,
2019-10-29T02:46:23.73644+00:00 app[web.1]: attempts: 1
2019-10-29T02:46:23.736442+00:00 app[web.1]: }
2019-10-29T02:46:23.747775+00:00 app[web.1]: POST /new_block 200 23.665 ms - 2
2019-10-29T02:46:24.204032+00:00 app[web.1]: SUCCESSFUL SEND
2019-10-29T02:46:24.204285+00:00 app[web.1]: {
2019-10-29T02:46:24.204289+00:00 app[web.1]: hash: 'D99B99CCDFB216663AADEDDB9D5103A11902DCE343457173DBA516E64AA31173',
2019-10-29T02:46:24.204291+00:00 app[web.1]: status: 'success'
2019-10-29T02:46:24.204293+00:00 app[web.1]: }
```