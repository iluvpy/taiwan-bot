import fs from 'fs';
import { MessageEmbed } from 'discord.js';

const CREDIT_DATA_PATH = './data/creditData.json';
const SEARCH_DATA_PATH = './data/searches.json';
var BAD_IMAGES = readImages('./data/bad/images.json');
var GOOD_IMAGES = readImages('./data/good/images.json');
var RANDOM_IMAGES = readImages('./data/random/images.json');


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  

function randomCredit() {
    const random = getRandomInt(5, 150);
    const front = parseInt(random / 10) * 10;
    const difference = random-front;
    if (difference > 2.5) {
        return random + 5 - difference;
    } 
    else {
        return random - 5 - difference;
    }
}

function readImages(json_path) {
    const imageLinks = [];
    fs.readFile(json_path, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const images = JSON.parse(data);
        for (var key in images) {
            imageLinks.push(images[key]);
        }
    })
    return imageLinks; 
}

function randomChoice(array) {
    return array[getRandomInt(0, array.length)];
}


function getEmbed(title, color, imgArray) {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setImage(randomChoice(imgArray))
    return embed;
}

function getGoodEmbed(text) {
    return { embeds: [getEmbed(text, 'GREEN', GOOD_IMAGES)] }
}

function getBadEmbed(text) {
    return { embeds: [getEmbed(text, 'RED', BAD_IMAGES)]};
}

function getRandomEmbed(text) {
    return { embeds: [getEmbed(text, 'RANDOM', RANDOM_IMAGES)]}
}

function saveData(data, path) {
    const string = JSON.stringify(data);
    fs.writeFile(path, string, (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

function readData(path) {
    var objData = {};
    const data = fs.readFileSync(path);
    objData = JSON.parse(data); 
    return objData;
}

function saveCreditData(data) {
    saveData(data, CREDIT_DATA_PATH);
}

function saveSearchData(data) {
    saveData(data, SEARCH_DATA_PATH);
}

function readCreditData() {
    return readData(CREDIT_DATA_PATH);
}

function readSearchData() {
    return readData(SEARCH_DATA_PATH);
}

function hasMention(message) {
    return message.mentions.members.size > 0;
}

function containsTaiwan(text) {
    return text.toLowerCase().includes('taiwan');
}



export {
    randomCredit, 
    readImages, 
    randomChoice,
    getBadEmbed,
    getGoodEmbed,
    getRandomEmbed,
    getEmbed,
    saveCreditData,
    saveSearchData,
    readCreditData,
    readSearchData,
    hasMention,
    containsTaiwan
};