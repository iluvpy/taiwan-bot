import {
    Client, 
    Intents,
    MessageEmbed
} from 'discord.js';
import { 
    containsTaiwan, 
    getBadEmbed,
    getGoodEmbed, 
    getRandomEmbed,
    hasMention,
    randomChoice, 
    randomCredit, 
    readCreditData,
    readSearchData, 
    readImages, 
    saveSearchData,
    saveCreditData, 
    getEmbed
} from './util.mjs';
import fs from 'fs';
import {exec} from 'child_process';
import { join } from 'path';


// Create a new client instance
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });
// add your own env variable
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const PREFIX = '!social'; // prefix
const JOIN_COMMAND = 'join'; // join social credit system
const CREDIT_COMMAND = 'credit'; // display credit
const SEARCH_COMMAND = 'search';

// read social credit data from json
var creditData = readCreditData();
// read search data
const searchData = readSearchData();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const content = message.content;
    const id = message.author.id;
    if (content.startsWith(PREFIX)) {
        const args = content.substring(PREFIX.length).split(' ');
        if (args.length <= 1) {
            message.reply(`you can register with '${PREFIX} ${JOIN_COMMAND}'\nsee your credit with '${PREFIX} ${CREDIT_COMMAND}'`);
        }   
        else if (args[1] === JOIN_COMMAND) {
            if (id in creditData) {
                message.channel.send(getGoodEmbed('you are already registered'));
            } 
            else {
                creditData[id] = 1000;
                message.channel.send(getGoodEmbed('you are now registered with +1000 social credit'));
            }
        }
        else if (args[1] === CREDIT_COMMAND) {
            if (hasMention(message)) {
                message.mentions.members.forEach(member => {
                    const id = member.id;
                    if (id in creditData) {
                        message.channel.send(`${member.user.tag} has ${creditData[id]} social credit`);
                    }
                });
                return;
            }
            if (id in creditData) {
                message.channel.send(`${creditData[id]}`);
            } 
            else {
                message.channel.send(getBadEmbed('you are not registered'));
            }
        }
        else if (args[1] === SEARCH_COMMAND) {
            if (args.length < 3) {
                message.reply('add search key words');
                return
            }
            const search = args.slice(2).join(' ');
            console.log(`search: ${search}`);
            if (search in searchData) {
                const results = searchData[search];
                message.channel.send({embeds: [getEmbed(search, 'RANDOM', results)]}); // send random img result from search
            }
            else {
                // generate img links
                process.chdir('./get_images'); // change dir for simplicity
                await new Promise(res => {
                    exec(`./env/bin/python ./main.py "${search}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        res();
                    });
                });
                
                process.chdir('..'); // go back to root dur
                // read img links
                const jsonData = fs.readFileSync('./get_images/links.json');
                const linksObj = JSON.parse(jsonData);
                const links = [];
                for (var key in linksObj) {
                    links.push(linksObj[key]);
                }
                console.log(`first image link: ${links[0]}`);
                searchData[search] = links;
                message.channel.send({embeds: [getEmbed(search, 'RANDOM', links)]}); // send random img result from search

            }
        }
        
    }

    else if (containsTaiwan(content)) {
        if (id in creditData) {
            const penalty = randomCredit();
            creditData[id] -= penalty;
            message.channel.send(getBadEmbed(`-${penalty} social credit`));
        }
    } 
    
});

// Login to Discord with your client's token
client.login(TOKEN);

// save data every 10 seconds (or more)
(async function main() {
    for (;;) {
        await new Promise(res => {
            setTimeout(res, 10000);
        });
        saveCreditData(creditData);
        saveSearchData(searchData);
    }
})();
