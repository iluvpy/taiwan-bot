import {Client, Intents} from 'discord.js';



// Create a new client instance
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });
// add your own env variable
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const PREFIX = "!taiwan";
var creditData = {};

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    const content = message.content;
    const id = message.author.id;
    if (content.startsWith(PREFIX)) {
        const args = content.substring(PREFIX.length).split(" ");
        if (args.length <= 1) {
            message.reply('puoi registrarti e recivere 1000 social credit con "!taiwan social", puoi vedere i tuoi social credit con "!taiwan credit"');
        }   
        else if (args[1] === 'social') {
            if (id in creditData) {
                message.reply('sei già registrato!');
            } 
            else {
                creditData[id] = 1000;
                message.reply('sei stato registrato con 1000 social credit');
            }
        }
        else if (args[1] === 'credit') {
            if (id in creditData) {
                message.reply(`${creditData[id]}`);
            } 
            else {
                message.reply("non sei ancora registrato");
            }
        }
        
    }

    else if (content.includes('taiwan')) {
        if (id in creditData) {
            creditData[id] -= 100;
            message.reply('-100 social credit');
        }
    }
});

// Login to Discord with your client's token
client.login(TOKEN);
