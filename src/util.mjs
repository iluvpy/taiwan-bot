

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

export {randomCredit};