import {Client, Intents, MessageEmbed} from 'discord.js';
import { getBadEmbed, getGoodEmbed, getRandomEmbed ,randomChoice, randomCredit, readCreditData, readImages, saveCreditData } from './util.mjs';
import fs from 'fs';


// Create a new client instance
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });
// add your own env variable
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const PREFIX = '!t';
const BAD_USER = '347298242653978624';

var creditData = readCreditData();


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    const content = message.content;
    const id = message.author.id;
    if (content.startsWith(PREFIX)) {
        const args = content.substring(PREFIX.length).split(' ');
        if (args.length <= 1) {
            message.reply('puoi registrarti e recivere 1000 social credit con \'!taiwan social\', puoi vedere i tuoi social credit con \'!taiwan credit\'');
        }   
        else if (args[1] === 'social') {
            if (id in creditData) {
                message.channel.send(getGoodEmbed('sei gia registrato'));
            } 
            else {
                creditData[id] = 1000;
                message.channel.send(getGoodEmbed('sei stato registrato con 1000 social credit'));
            }
        }
        else if (args[1] === 'credit') {
            if (id in creditData) {
                message.channel.send(`${creditData[id]}`);
            } 
            else {
                message.channel.send(getBadEmbed('non sei ancora registrato'));
            }
        }
        
    }

    else if (content.includes('taiwan')) {
        if (id in creditData) {
            const penalty = randomCredit();
            creditData[id] -= penalty;
            message.channel.send(getBadEmbed(`-${penalty} social credit`));
        }
    } 
    else if (message.mentions.has(BAD_USER)) {
        const penalty = randomCredit();
        creditData[id] -= penalty;
        message.channel.send(getBadEmbed(`-${penalty} social credit`));
    }
});

// Login to Discord with your client's token
client.login(TOKEN);

// save credit data every 10 seconds
(async function main() {
    for (;;) {
        await new Promise(res => {
            setTimeout(res, 10000);
        });
        saveCreditData(creditData);
    }
})();
