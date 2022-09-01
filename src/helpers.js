function setNextFunction(functionName) {
    nextFunction = functionName;
    recentActions.unshift(functionName);
    if(recentActions.length > 2) recentActions.pop();
}

function writeWithHelpMenu(question, menu, functionName) {
    if(!recentActions.includes(functionName)) write(question + menu);
    else write(question);
}

function updateResources(){
    population = idleVillagers + farmers + miners + woodcutters + spearmen + swordsmen + archers + scouts + horsemen + mineCarts + farmCarts; //warCarts do not have population
    housing = smallHouse * 5 + largeHouse * 10;
    horsePopulation = idleHorses + horsemen + woodCarts * 2 + mineCarts * 2 + farmCarts * 2 + warCarts * 2;
    document.getElementById('stone').textContent = stone;
    document.getElementById('wood').textContent = wood;
    document.getElementById('vines').textContent = vines;
    document.getElementById('iron').textContent = iron;
    document.getElementById('gold').textContent = gold;
    document.getElementById('food').textContent = food;

    document.getElementById('idleVillagers').textContent = idleVillagers;
    document.getElementById('farmers').textContent = farmers;
    document.getElementById('miners').textContent = miners;
    document.getElementById('woodcutters').textContent = woodcutters;
    document.getElementById('spearmen').textContent = spearmen;
    document.getElementById('swordsmen').textContent = swordsmen;
    document.getElementById('archers').textContent = archers;
	document.getElementById('scouts').textContent = scouts;

    document.getElementById('totalHorses').textContent = horsePopulation;
    document.getElementById('availableStalls').textContent = stable * 5;
    document.getElementById('idleHorses').textContent = idleHorses;
    document.getElementById('farmCarts').textContent = farmCarts;
    document.getElementById('mineCarts').textContent = mineCarts;
    document.getElementById('woodCarts').textContent = woodCarts;
    document.getElementById('warCarts').textContent = warCarts;
    document.getElementById('horsemen').textContent = horsemen;

    document.getElementById('hoes').textContent = hoes;
    document.getElementById('picks').textContent = picks;
    document.getElementById('axes').textContent = axes;
    document.getElementById('spears').textContent = spears;
    document.getElementById('swords').textContent = swords;
    document.getElementById('bows').textContent = bows;
	document.getElementById('daggers').textContent = daggers;

    document.getElementById('availableHousing').textContent = housing;
    document.getElementById('population').textContent = population;

    document.getElementById('storage').textContent = stockpile * 250 - storageLeft();
    document.getElementById('maxStorage').textContent = stockpile * 250;

    document.getElementById('foodProduction').textContent = foodProduction();
    document.getElementById('foodConsumption').textContent = foodConsumption();

    document.getElementById('day').textContent = day;
    var timeSpan = document.getElementById('time');
    timeSpan.textContent = '';
    var hour = Math.floor(time / 4);
    var minute = time % 4 * 15;
    if (minute == 0) minute = "00";
    if (time < 24) timeSpan.textContent = hour + 6 + ":" + minute + " am";
    else if (23 < time  && time < 28) timeSpan.textContent = hour + 6 + ":" + minute + " PM";
    else timeSpan.textContent = hour - 6 + ":" + minute + " PM";
}

function storageLeft(){
    return stockpile * 250 - hoes - picks - axes - spears - swords - bows - stone  - wood - iron - vines - food;
}

function foodProduction() { return Math.round(farmers + farmCarts * 3 + (farmers + farmCarts * 3) * (farm / 5)); }
function foodConsumption() { return Math.floor(population / 5); }

function pluralize(count, noun){
      if(noun.endsWith('man')) return `${count} ${noun.slice(0,-3)}${count !== 1 ? 'men' : 'man'}`;
      else return `${count} ${noun}${count !== 1 ? 's' : ''}`;
  }

function write(text) {
    if(isWriting) return;
    isWriting = true;
    var i = 0;
    var speed = 13;
    document.getElementById('content').innerHTML += '<br>';
    document.getElementById('content').innerHTML += '<br>';

    var timer=setInterval(function(){
        if(i<text.length) {
            if(text.charAt(i) == '^') {
                document.getElementById("content").innerHTML += '<br>';
                i++;
            }
            else {
                document.getElementById('content').innerHTML += text.charAt(i);
                i++;
            }
        }
        else {
            clearInterval(timer);
            isWriting = false;
        }
    },speed);
    document.getElementById("content").innerText = document.getElementById('content').innerText.slice(-4000, document.getElementById("content").innerText.length);
}

function isWholeNumber(number){
    if(isNaN(number)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return false;
    }
    if(number < 0){
        write("Please input a number above zero.");
        document.getElementById('inputTextBox').value = "";
        return false;
    }
    if(number % 1 != 0){
        write("Please input a whole number.");
        document.getElementById('inputTextBox').value = "";
        return false;
    }
    return true;
}
