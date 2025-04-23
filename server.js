// Supports ES6
// import { create, Whatsapp } from '@wppconnect-team/wppconnect';
const wppconnect = require('@wppconnect-team/wppconnect');
const request = require('request');
const express = require('express');

// const url = "https://n8n.paas.alitec.asia/webhook-test/9b81d654-7bae-4620-a359-bd26cb158813";
const url = "https://n8n.paas.alitec.asia/webhook/9b81d654-7bae-4620-a359-bd26cb158813";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

function post_SendMessage(client) {
    server.post('/send-message', (req, res) => {
        const wa_id = req.body.wa_id;
        const message = req.body.message;

        console.log("Sending message!: ", req.body);

        client.sendText(wa_id, message)

        res.send("Message sent successfully");
    })
}

function post_ListMessages(client) {
    client.onMessage((msg) => {
        const options = {
            "method": "POST",
            "url": url,
            "Headers": {
                "Content-Type": "application/json"
            },
            json: msg
        }

        request(options, (error) => {
            if (error) {
                throw new Error(error);
            }
        });
    })
}

wppconnect
  .create({session: 'Gdsession'})
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
    console.log('Client has started!');

    post_ListMessages(client);
    console.log('Listening to messages...');
    post_SendMessage(client);
    console.log('Listening to send-message...');
    // listen_message(client)
}

// function listen_message(client) {
//     client.onMessage((msg) => {
//         const wa_id = msg.from
//         const message = "This is a response message from WPPConnect";

//         client.sendText(wa_id, message)
//     })
// }

server.listen(3000, () => {
    console.log('Listening to port 3000');
})
