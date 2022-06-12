//bacon

//TODO:
//Market buy & sell - DONE
//night attacks - DONE
//add lose conditions - DONE
//farm upgrades - DONE
//scouting
//attacking camps
//horses & carts
//better help menus
//village defense
//cookie saves
//Change sky color based on time
//better resource UI
//representative graphics
//unit upgrades

var isWriting = false;
var nextFunction = null;

var buildItem = {
    name: null,
    variable: null,
    woodCost: null,
    stoneCost: null,
    ironCost: null,
    buildTime: null
};

var upgradeItem = {
    name: null,
    variable: null,
    woodCost: null,
    stoneCost: null,
    ironCost: null,
    maxLevel: null,
    upgradeTime: null
};

var forgeItem = {
    name: null,
    woodCost: null,
    stoneCost: null,
    ironCost: null,
    vineCost: null,
    forgeTime: null,
    forgeLevel: null
};

var TrainItem = {
    name: null,
    variable: null,
    neededItemVariable: null,
    goldCost: null,
    trainTime: null,
    barracksLevel: null
};

function EnemyCamp(id, level, visbilityLevel, orcs, ogres, slingers, gold, iron, vines, stone, wood, food) {
	this.id = id;
	this.level = level;
	this.visibilityLevel = visibilityLevel;
	this.orcs = orcs;
	this.ogres = ogres;
	this.slingers = slingers;
	this.gold = gold;
	this.iron = iron;
	this.vines = vines;
	this.stone = stone;
	this.wood = wood;
	this.food = food;
}

var identifiedCamps = [];	

var discardItem = null;
var marketChoice = null;
var marketItem = null;

var time;
var day;

//resources
var storage;
var stone;
var wood;
var iron;
var vines;
var gold;
var food;

//Items
var hoes;
var picks;
var axes;
var spears;
var swords;
var bows;
var daggers;

var foodProduction;

//population
var housing;
var population;
var idlePeasants;
var farmers;
var miners;
var woodcutters;
var spearmen;
var swordsmen;
var archers;
var scouts;

//buildings
var blacksmithLevel;
var barracks;
var farm;
var smallHouse;
var largeHouse;
var stable;
var stockpile;
var market;

function updateResources(){
    population = idlePeasants + farmers + miners + woodcutters + spearmen + swordsmen + archers;
    housing = smallHouse * 5 + largeHouse * 10;
    document.getElementById('stone').textContent = stone;
    document.getElementById('wood').textContent = wood;
    document.getElementById('vines').textContent = vines;
    document.getElementById('iron').textContent = iron;
    document.getElementById('gold').textContent = gold;
    document.getElementById('food').textContent = food;

    document.getElementById('idlePeasants').textContent = idlePeasants;
    document.getElementById('farmers').textContent = farmers;
    document.getElementById('miners').textContent = miners;
    document.getElementById('woodcutters').textContent = woodcutters;
    document.getElementById('spearmen').textContent = spearmen;
    document.getElementById('swordsmen').textContent = swordsmen;
    document.getElementById('archers').textContent = archers;
	document.getElementById('scouts').textContent = scouts;
	
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

function foodProduction() { return Math.round(farmers + farmers * (farm / 5)); }
function foodConsumption() { return Math.floor(population / 5); }

  function pluralize(count, noun){
      if(noun.endsWith('man')) return `${count} ${noun.slice(0,-3)}${count !== 1 ? 'men' : 'man'}`;
      else return `${count} ${noun}${count !== 1 ? 's' : ''}`;
  }

function write(text) {
//let text = document.getElementById("inputTextBox").innerHTML;
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
    },speed)
}

function init(){
    nextFunction = null;
    time = 0;
    day = 1;

    stone = 20;
    wood = 35;
    iron = 4;
    vines = 2;
    gold = 10;
    food = 5;

    idlePeasants = 4;
    farmers = 1;
    miners = 2;
    woodcutters = 2;
    spearmen = 2;
    swordsmen = 1;
    archers = 0;
	scouts = 0;

    hoes = 2;
    picks = 1;
    axes = 1;
    spears = 0;
    swords = 0;
    bows = 0;
	daggers = 0;

    blacksmithLevel = 3;
    barracksLevel = 3;
    farm = 0;
    smallHouse = 1;
    largeHouse = 1;
    stable = 0;
    stockpile = 1;
    market = 0;

    updateResources();
    //write("It's a war torn land. Villages are being raided every day by the elusive Woodland Prowlers. Every day, more and more of them arrive. Every day, more and more villagers die. They need a leader. A hero. This hero... is You!^^Welcome to our village. My name is Andor. We have been raided by the Woodland Prowlers. We have a small militia left and some resources, but not many. Please help us. I am giving you control of the village.^You can build new buildings, hire workers, train soldiers, and gather materials.");
}

function processInput(){
    if(isWriting) return;

    if(nextFunction) {
        nextFunction();
        return;
    }

    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            giveHelp();
            break;
        case 'm':
            goMining();
            break;
        case 'w':
            goWoodCutting();
            break;
        case 't':
            train();
            break;
        case 's':
            sleep();
            break;
        case 'b':
            build();
            break;
        case 'f':
            forge();
            break;
        case 'u':
            upgrade();
            break;
        case 'd':
            discard();
            break;
        case 'a':
            goToMarket();
            break;
		case 'g':
			goScouting();
			break;
        default:
            write("Not a valid input!");
    }
    document.getElementById('inputTextBox').value = "";
}

function giveHelp(){
    write("Options:^m: Go mining^w: Go woodcutting^b: Build buildings^u: Upgrade buildings^t: Train workers^f: Forge equipment^a: Buy/sell supplies at the market^g: Scout for enemy camps^l: View enemy camp stats^s: Sleep^d: Discard items^n: Manage carts");
}

function goMining(){
    if(time > 56) {
        write("It's too late to go mining. Mining takes two hours.")
        return;
    }
    if(storageLeft() <= 0){
        write("Your stockpile is full and you cannot go mining.");
        return;
    }
    var stoneGet = Math.floor(Math.random() * 13 + 10);
    var ironGet = Math.floor(Math.random() * 11 - 5);
    if(ironGet < 0) ironGet = 0;

    if(ironGet > storageLeft()) {
        ironGet = storageLeft();
        stoneGet = 0;
    }
    if(ironGet + stoneGet > storageLeft()){
        stoneGet = storageLeft() - ironGet;
    }

    if (ironGet > 0) {
        write("Gathered " + stoneGet + " stone and " + ironGet + " iron.");
        iron += ironGet;
    }
    else write("Gathered " + stoneGet + " stone.")
    stone += stoneGet;
    time += 8;
    updateResources();
}

function goWoodCutting(){
    if(time > 56) {
        write("It's too late to go woodcutting. Woodcutting takes two hours.")
        return;
    }
    if(storageLeft() <= 0){
        write("Your stockpile is full and you cannot go woodcutting.");
        return;
    }
    var woodGet = Math.floor(Math.random() * 14 + 11);
    var vineGet = Math.floor(Math.random() * 10 - 5);
    if (vineGet < 0) vineGet = 0;

    if(vineGet > storageLeft()) {
        vineGet = storageLeft();
        woodGet = 0;
    }
    if(vineGet + woodGet > storageLeft()){
        woodGet = storageLeft() - vineGet;
    }

    if (vineGet > 0) {
        write("Gathered " + woodGet + " wood and " +  pluralize(vineGet, "vine") + ".");
        vines += vineGet;
    }
    else write("Gathered " + woodGet + " wood.")
    wood += woodGet;
    time += 8;
    updateResources();
}

function sleep(){
    if(food - foodConsumption() + foodProduction() <= 0){
        write("^You have run out of food and the village has starved! Better luck next time.");
        document.getElementById("inputTextBox").disabled = true;
        food = 0;
        updateResources();
        return;
    }
    var sleepMessage = "--------------------------------";
    sleepMessage += processNightAttack(sleepMessage);

    if(food - foodConsumption() + foodProduction() <= 0){
        sleepMessage += "The attackers made off with all of your food and the village has starved. Better luck next time.";
        write(sleepMessage);
        document.getElementById("inputTextBox").disabled = true;
        food = 0;
        updateResources();
        return;
    }

    time = 0;
    day += 1;

    //food
    food -= foodConsumption();
    var foodGet = foodProduction();
    if(foodGet >= storageLeft()) {
        foodGet = storageLeft();
        food += foodGet;
        sleepMessage += "You ran out of space in your stockpile, and you were only able to store " + foodGet + " food. Consider discarding or selling unnecessary resources.^^";
    }
    else food += farmers;

    //population
    if(population < housing){
        var newVillagerModifier = Math.round(Math.random() * 2.5);
        var newVillagers = Math.floor((housing - population) / 5 + newVillagerModifier);
        if(newVillagers + population > housing) newVillagers = housing - population;
        idlePeasants += newVillagers;
        if (newVillagers > 0) sleepMessage += pluralize(newVillagers, "new villager") + " came to the village last night.^^";
    }

    //taxes
    var taxes = Math.floor((idlePeasants + farmers + miners + woodcutters) / 5);
    gold += taxes;
    sleepMessage += "You collected " + taxes + " gold in taxes.^^";

    //miners and Woodcutters
    var stoneGet = 0;
    var ironGet = 0;
    var woodGet = 0;
    var vineGet = 0;
    for(var i=0;i<miners;i++){
        ironGet += Math.floor(Math.random() * 2);
        stoneGet += Math.floor(Math.random() * 4 + 4);
    }
    for(var i=0;i<woodcutters;i++){
        vineGet += Math.floor(Math.random() * 2);
        woodGet += Math.floor(Math.random() * 4 + 4);
    }
    if(ironGet > storageLeft()) ironGet = storageLeft();
    iron += ironGet;
    if(vineGet > storageLeft()) vineGet = storageLeft();
    vines += vineGet;
    if(stoneGet > storageLeft()) stoneGet = storageLeft();
    stone += stoneGet;
    if(woodGet > storageLeft()) woodGet = storageLeft();
    wood += woodGet;

    sleepMessage += "Your workers gathered the following resources: " + "^Iron: " + ironGet + "^Vines: " + vineGet + "^Stone: " + stoneGet + "^Wood: " + woodGet + "^^";
    if(storageLeft() <= 0) sleepMessage += "No more storage space left.^^";

    if(food - ((foodConsumption() - foodProduction()) * 3) <= 0) sleepMessage += "You don't have much food left in your stockpile. Train farmers to ensure adequate food production.^^";

    sleepMessage += "It is now day " + day + ". What would you like to do next?";
    write(sleepMessage);

    updateResources();
}

function build(){
    if (time > 60) {
        write("It's too late to build anything right now.");
        return;
    }
    write("What would you like to build?^b: Blacksmith^a: Barracks^s: Small House^l: Large House^m: Market^h: Help^c: Cancel");
    nextFunction = processBuilding;
}

function processBuilding(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'b':
            buildItem = {
                name: "blacksmith",
                variable: "blacksmithLevel",
                woodCost: 50,
                stoneCost: 75,
                ironCost: 10,
                buildTime: 4
            };
            break;
        case 'a':
            buildItem = {
                name: "barracks",
                variable: "barracksLevel",
                woodCost: 75,
                stoneCost: 50,
                ironCost: 5,
                buildTime: 4
            };
            break;
        case 's':
            buildItem = {
                name: "small house",
                variable: "smallHouse",
                woodCost: 75,
                stoneCost: 50,
                ironCost: 0,
                buildTime: 4
            };
            break;
        case 'l':
            buildItem = {
                name: "large house",
                variable: "largeHouse",
                woodCost: 125,
                stoneCost: 75,
                ironCost: 0,
                buildTime: 4
            };
            break;
        case 'm':
            buildItem = {
                name: "market",
                variable: "market",
                woodCost: 150,
                stoneCost: 100,
                ironCost: 0,
                buildTime: 4
            };
            break;
        case 'c':
            write("Cancelled build.^^What would you like to do next?");
            nextFunction = null;
            break;
        default:
            write("Not a valid build. Please try again.");
            break;
    }

    var buildMessage = "";

    if (buildItem.variable == blacksmithLevel ||
        buildItem.variable == barracksLevel ||
        buildItem.variable == market){
            write("You already have a level " + window[buildItem.variable] + " " + buildItem.name + ". To upgrade your " + buildItem.name + ", choose \"upgrade\" (\"u\") at the main menu.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
        }

    if(buildItem.woodCost > wood) buildMessage += "Not enough wood.^Required: " + buildItem.woodCost + "^Current: " + wood + "^^";
    if(buildItem.stoneCost > stone) buildMessage += "Not enough stone.^Required: " + buildItem.stoneCost + "^Current: " + stone + "^^";
    if(buildItem.ironCost > wood) buildMessage += "Not enough iron.^Required: " + buildItem.ironCost + "^Current: " + iron + "^^";
    if(buildItem.buildTime + time > 64) buildMessage += "You don't have enough time to build a " + buildItem.name + ".^^";

    if(!buildMessage) {
        wood -= buildItem.woodCost;
        stone -= buildItem.stoneCost;
        iron -= buildItem.ironCost;
        time += buildItem.buildTime;
        window[buildItem.variable]++;
        buildMessage += "You have built a " + buildItem.name + ".^^";
    }

    updateResources();
    buildMessage += "What would you like to do next?";
    write(buildMessage);
    nextFunction = null;
    document.getElementById('inputTextBox').value = "";
}

function upgrade(){
    write("What would you like to upgrade?^b: Blacksmith^a: Barracks^s: Stockpile^f: Farm^h: Help^c: Cancel");
    nextFunction = processUpgrading;
}

function processUpgrading(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'a':
            upgradeItem = {
                name: "barracks",
                variable: "barracksLevel",
                woodCost: 75 * (barracksLevel + 1),
                stoneCost: 50 * (barracksLevel + 1),
                ironCost: 1 * (barracksLevel + 1),
                maxLevel: null,
                upgradeTime: 4
            };
            break;
        case 'b':
            upgradeItem = {
                name: "blacksmith",
                variable: "blacksmithLevel",
                woodCost: 50 * (blacksmithLevel + 1),
                stoneCost: 75 * (blacksmithLevel + 1),
                ironCost: 4 * (blacksmithLevel + 1),
                maxLevel: null,
                upgradeTime: 4
            };
            break;
        case 's':
            upgradeItem = {
                name: "stockpile",
                variable: "stockpile",
                woodCost: 50,
                stoneCost: 75,
                ironCost: 0,
                maxLevel: null,
                upgradeTime: 4
            };
            break;
        case 'f':
            upgradeItem = {
                name: "farms",
                variable: "farm",
                woodCost: 100 * (farm + 1),
                stoneCost: 25 * (farm + 1),
                ironCost: 1 * (farm + 1),
                maxLevel: null,
                upgradeTime: 4
            };
            break;
        case 'c':
            write("Cancelled upgrade.^^What would you like to do next?");
            nextFunction = null;
            break;
        default:
            write("Not a valid upgrade. Please try again.");
            break;
    }

    var upgradeMessage = "";
    if(upgradeItem.maxLevel != null && window[upgradeItem.variable] >= upgradeItem.maxLevel) {
        write("Your " + buildItem.name + " is already at the maximum level of " + upgradeItem.maxLevel + ".^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    if (upgradeItem.variable == blacksmithLevel ||
        upgradeItem.variable == barracksLevel){
            write("You do not have a  " + upgradeItem.name + " yet. To build a " + builditem.name + ", choose \"build\" (\"b\") at the main menu.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
        }

    if(upgradeItem.woodCost > wood) upgradeMessage += "Not enough wood.^Required: " + upgradeItem.woodCost + "^Current: " + wood + "^^";
    if(upgradeItem.stoneCost > stone) upgradeMessage += "Not enough stone.^Required: " + upgradeItem.stoneCost + "^Current: " + stone + "^^";
    if(upgradeItem.ironCost > wood) upgradeMessage += "Not enough iron.^Required: " + upgradeItem.ironCost + "^Current: " + iron + "^^";
    if(upgradeItem.upgradeTime + time > 64) upgradeMessage += "You don't have enough time to upgrade your " + upgradeItem.name + ".^^";

    if(!upgradeMessage) {
        wood -= upgradeItem.woodCost;
        stone -= upgradeItem.stoneCost;
        iron -= upgradeItem.ironCost;
        time += upgradeItem.upgradeTime;
        window[upgradeItem.variable]++;
        upgradeMessage += "You have upgraded your  " + upgradeItem.name + " to level " + window[upgradeItem.variable] + ".^^";
    }

    updateResources();
    upgradeMessage += "What would you like to do next?";
    write(upgradeMessage);
    nextFunction = null;
    document.getElementById('inputTextBox').value = "";
}

function forge(){
    if (time > 63) {
        write("It's too late to forge anything right now.^^What would you like to do next?");
        return;
    }
    if(blacksmithLevel == 0) {
        write("You must build a blacksmith before you can forge weapons and tools.^^What would you like to do next?");
        return;
    }
    write("What would you like to forge?^o: Hoe^p: Pick^a: Axe^s: Spear^w: Sword^b: Bow^d: Dagger^h: Help^c: Cancel");
    nextFunction = processForging;
}

function processForging(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'o':
            write("How many hoes would you like to forge?");
            forgeItem = {
                name: "hoe",
                variable: "hoes",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                blacksmithLevel: 1
            };
            nextFunction = processForgingCount;
            break;
        case 'p':
            write("How many picks would you like to forge?");
            forgeItem = {
                name: "pick",
                variable: "picks",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                blacksmithLevel: 1
            };
            nextFunction = processForgingCount;
            break;
        case 'a':
            write("How many axes would you like to forge?");
            forgeItem = {
                name: "axe",
                variable: "axes",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                blacksmithLevel: 1
            };
            nextFunction = processForgingCount;
            break;
        case 's':
            write("How many spears would you like to forge?");
            forgeItem = {
                name: "spear",
                variable: "spears",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 1,
                blacksmithLevel: 1
            };
            nextFunction = processForgingCount;
            break;
        case 'w':
            write("How many swords would you like to forge?");
            forgeItem = {
                name: "sword",
                variable: "swords",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 2,
                vineCost: 0,
                forgeTime: 1,
                blacksmithLevel: 2
            };
            nextFunction = processForgingCount;
            break;
        case 'b':
            write("How many bows would you like to make?");
            forgeItem = {
                name: "bow",
                variable: "bows",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 0,
                vineCost: 2,
                forgeTime: 1,
                blacksmithLevel: 2
            };
            nextFunction = processForgingCount;
            break;
		case 'd':
            write("How many daggers would you like to forge?");
            forgeItem = {
                name: "dagger",
                variable: "daggers",
                stoneCost: 0,
                woodCost: 1,
                ironCost: 1,
                vineCost: 0,
                forgeTime: 2,
                blacksmithLevel: 3
            };
            nextFunction = processForgingCount;
            break;
        case 'c':
            write("Cancelled forging.^^What would you like to do next?");
            nextFunction = null;
            break;
        default:
            write("Not a valid choice. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}

function processForgingCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled forge.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var count = parseInt(document.getElementById('inputTextBox').value);
    var canForge = true;
    var forgeError = "";
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(blacksmithLevel < forgeItem.blacksmithLevel){
        write("You must upgrade your blacksmith to forge " + forgeItem.variable + ".^Current level: " + blacksmithLevel + "^Required level: " + forgeItem.blacksmithLevel + "^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(time + forgeItem.forgeTime * count > 64){
        write("You don't have enough time to forge " + pluralize(count, forgeItem.name) + ".^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(stone < forgeItem.stoneCost * count){
        forgeError += "Not enough stone.^Required: " + forgeItem.stoneCost * count + "^Curent: " + stone + "^^";
        canForge = false;
    }

    if(wood < forgeItem.woodCost * count){
        forgeError += "Not enough wood.^Required: " + forgeItem.woodCost * count + "^Current: " + wood + "^^";
        canForge = false;
    }

    if(iron < forgeItem.ironCost * count){
        forgeError += "Not enough iron.^Required: " + forgeItem.ironCost * count + "^Current: " + iron + "^^";
        canForge = false;
    }

    if(vines < forgeItem.vineCost * count){
        forgeError += "Not enough vines.^Required: " + forgeItem.vineCost * count + "^Current: " + vines + "^^";
        canForge = false;
    }

    if(canForge){
        time += forgeItem.forgeTime * count;
        stone -= forgeItem.stoneCost * count;
        wood -= forgeItem.woodCost * count;
        iron -= forgeItem.ironCost * count;
        vines -= forgeItem.vineCost * count;
        window[forgeItem.variable] += count;
        updateResources();
        write("You have forged " + pluralize(count, forgeItem.name) + ".^^What would you like to do next?");
        nextFunction = null;
    }
    else{
        write(forgeError + "What would you like to do next?");
        nextFunction = null;
    }
    document.getElementById('inputTextBox').value = "";
}

function train(){
    if (time > 63) {
        write("It's too late to train troops or workers right now.^^What would you like to do next?");
        return;
    }
    if(idlePeasants == 0) {
        write("You do not have any idle peasants that can be trained.^^What would you like to do next?");
        return;
    }
    write("What would you like to train?^f: Farmer^m: Miner^w: Woodcutter^s: Spearman^o: Swordsman^a: Archer^u: Scout^h: Help^c: Cancel");
    nextFunction = processTraining;
}

function processTraining(){
    switch(document.getElementById('inputTextBox').value) {
        case 'h':
            write("I can help!");
            break;
        case 'f':
            write("How many farmers would you like to train?");
            trainItem = {
                name: "farmer",
                variable: "farmers",
                neededItemVariable: "hoes",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 0
            };
            nextFunction = processTrainingCount;
            break;
        case 'm':
            write("How many miners would you like to train?");
            trainItem = {
                name: "miner",
                variable: "miners",
                neededItemVariable: "picks",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 0
            };
            nextFunction = processTrainingCount;
            break;
        case 'w':
            write("How many woodcutters would you like to train?");
            trainItem = {
                name: "woodcutter",
                variable: "woodcutters",
                neededItemVariable: "axes",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 0
            };
            nextFunction = processTrainingCount;
            break;
        case 's':
            write("How many spearmen would you like to train?");
            trainItem = {
                name: "spearman",
                variable: "spearmen",
                neededItemVariable: "spears",
                goldCost: 1,
                trainTime: 1,
                barracksLevel: 1
            };
            nextFunction = processTrainingCount;
            break;
        case 'o':
            write("How many swordsmen would you like to train?");
            trainItem = {
                name: "swordsman",
                variable: "swordsmen",
                neededItemVariable: "swords",
                goldCost: 1,
                trainTime: 2,
                barracksLevel: 2
            };
            nextFunction = processTrainingCount;
            break;
        case 'a':
            write("How many archers would you like to train?");
            trainItem = {
                name: "archer",
                variable: "archers",
                neededItemVariable: "bows",
                goldCost: 2,
                trainTime: 2,
                barracksLevel: 2
            };
            nextFunction = processTrainingCount;
            break;
		case 'u':
            write("How many scouts would you like to train?");
            trainItem = {
                name: "scout",
                variable: "scouts",
                neededItemVariable: "daggers",
                goldCost: 2,
                trainTime: 2,
                barracksLevel: 3
            };
            nextFunction = processTrainingCount;
            break;
        case 'c':
            write("Cancelled training.^^What would you like to do next?");
            nextFunction = null;
            break;
        default:
            write("Not a valid choice. Please try again.");
            break;
    }
    document.getElementById('inputTextBox').value = "";
}

function processTrainingCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled training.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var count = parseInt(document.getElementById('inputTextBox').value);
    var canTrain = true;
    var trainError = "";
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(barracksLevel < trainItem.barracksLevel){
        write("You must upgrade your barracks to train " + trainItem.variable + ".^Current level: " + barracksLevel + "^Required level: " + trainItem.barracksLevel + "^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(time + trainItem.trainTime * count > 64){
        write("You don't have enough time to train " + pluralize(count, trainItem.name) + ".^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(gold < trainItem.goldCost * count){
        trainError += "Not enough gold.^Required: " + trainItem.goldCost * count + "^Curent: " + gold + "^^";
        canTrain = false;
    }

    if(idlePeasants < count){
        trainError += "Not enough idle peasants to train.^Required: " + count + "^Curent: " + idlePeasants + "^^";
        canTrain = false;
    }

    if(count > window[trainItem.neededItemVariable]) {
        trainError += "Not enough " + trainItem.neededItemVariable + ".^Required: " + count + "^Current: " + window[trainItem.neededItemVariable] + "^^";
        canTrain = false;
    }

    if(canTrain){
        time += trainItem.trainTime * count;
        gold -= trainItem.goldCost * count;
        window[trainItem.neededItemVariable] -= count;
        idlePeasants -= count;
        window[trainItem.variable] += count;
        updateResources();
        write("You have trained " + pluralize(count, trainItem.name) + ".^^What would you like to do next?");
        nextFunction = null;
    }
    else{
        write(trainError + "What would you like to do next?");
        nextFunction = null;
    }
    document.getElementById('inputTextBox').value = "";
}

function discard(){
    write("What would you like to discard?^s: Stone^w: Wood^i: Iron^v: Vines^c: Cancel");
    nextFunction = processDiscarding;
    return;
}

function processDiscarding(){
    switch(document.getElementById('inputTextBox').value) {
        case 's':
            discardItem = "stone";
            break;
        case 'w':
            discardItem = "wood";
            break;
        case 'i':
            discardItem = "iron";
            break;
        case 'v':
            discardItem = "vines";
            break;
        case 'c':
            write("Cancelled discard.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
    }
    write("What quantity of " + discardItem + " would you like to discard?");
    nextFunction = processDiscardingCount;
    document.getElementById('inputTextBox').value = "";
}

function processDiscardingCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled discard.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    var count = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(count > window[discardItem]){
        write("You cannot discard that quantity of " + discardItem + ", since you only have " + window[discardItem] + ".^^What quantity of " + discardItem + " would you like to discard?");
    }
    else{
        window[discardItem] -= count;
        updateResources();
        if(count == 1 && discardItem == "vines") write("You have discarded 1 vine.^^What would you like to do next?");
        else write("You have discarded " + count + " " + discardItem + ".^^What would you like to do next?");
        nextFunction = null;
    }
    document.getElementById('inputTextBox').value = "";
}

function goToMarket(){
    if(market == 0){
        write("You must first build a market before you can buy or sell resources.^^What would you like to do next?");
        return;
    }
    write("What would you like to do at the market?^b: Buy resources^s: Sell Resources^c: Cancel");
    nextFunction = marketBuyOrSell;
    return;
}

function marketBuyOrSell(){
    switch(document.getElementById('inputTextBox').value) {
        case 'b':
            marketChoice = "buy";
            write("What would you like to buy?^s: Stone^w: Wood^i: Iron^v: Vines^c: Cancel");
            break;
        case 's':
            marketChoice = "sell";
            write("What would you like to sell?^s: Stone^w: Wood^i: Iron^v: Vines^c: Cancel");
            break;
        case 'c':
            write("Cancelled market action.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
    }
    nextFunction = marketItemChoice;
    document.getElementById('inputTextBox').value = "";
}

function marketItemChoice(){
    switch(document.getElementById('inputTextBox').value) {
        case 's':
            marketItem = "stone";
            break;
        case 'w':
            marketItem = "wood";
            break;
        case 'i':
            marketItem = "iron";
            break;
        case 'v':
            marketItem = "vines";
            break;
        case 'c':
            write("Cancelled market action.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
    }
    write("How many stacks of " + marketItem + " would you like to " + marketChoice + "?^^Wood and stone: stacks of 50 for 1 gold^^Iron and vines: stacks of 5 for 1 gold.");
    nextFunction = marketCount;
    document.getElementById('inputTextBox').value = "";
}

function marketCount(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled market action.^^What would you like to do next?")
        nextFunction = null;;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    var count = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(count)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    var goldCount = count;
    if(marketItem == "wood" || marketItem == "stone") count *= 50;
    else if(marketItem == "vines" || marketItem == "iron") count *= 5;

    if(marketChoice == "sell"){
        if(count > window[marketItem]){
            write("You cannot sell that quantity of " + marketItem + ", since you only have " + window[marketItem] + ".^^How many stacks of " + marketItem + " would you like to sell?");
        }
        else{
            window[marketItem] -= count;
            gold += goldCount;
            updateResources();
            write("You have sold " + count + " " + marketItem + " for " + goldCount + " gold.^^What would you like to do next?");
            nextFunction = null;
        }
    }
    else if(marketChoice == "buy"){
        if(count > storageLeft()) write("You do not have enough storage space to buy that quantity of " + marketItem + ".^^How many stacks of " + marketItem + " would you like to buy?");
        else if(gold < goldCount) write("You do not have enough gold to buy that quantity of " + marketItem + ".^^How many stacks of " + marketItem + " would you like to buy?");
        else{
            window[marketItem] += count;
            gold -= goldCount;
            updateResources();
            write("You have bought " + count + " " + marketItem + " for " + goldCount + " gold.^^What would you like to do next?");
            nextFunction = null;
        }
    }
    document.getElementById('inputTextBox').value = "";
}

function processNightAttack(attackMessage){
    attackMessage = "^^";
    var attackChance = Math.round(Math.random() * (day * 2) + 5);
    //attackChance = 1; //DEBUG
    if(attackChance > day) return attackMessage;
    else{
        var enemyOrcs = Math.ceil((Math.random() * (day / 2)**1.5) + 2);
        var enemyOgres = Math.max(0,Math.ceil((Math.random() * (day / 2)**1.5) - 4));
        var enemyPower = enemyOrcs + enemyOgres * 2;
        var friendlyPower = spearmen + swordsmen * 2 + archers / 2;
        var lostSpearmen = 0;
        var lostSwordsmen = 0;
        var lostArchers = 0;

        enemyPower -= Math.ceil(archers * (Math.random() * .15 + .25));

        if(enemyPower > friendlyPower){
            enemyPower -= friendlyPower;
            spearmen = 0;
            swordsmen = 0;
            archers = 0;
            friendlyPower = 0;
        }
        else{
            for(var i=1;i<enemyPower;i++){
                if(i % 3 == 0){
                    if(swordsmen - lostSwordsmen > 0) lostSwordsmen++;
                    else if(spearmen - lostSpearmen > 0) lostSpearmen++;
                    else if(archers - lostArchers > 0) lostArchers++;
                }
                else if(i % 5 == 0){
                    if(archers - lostArchers > 0) lostarchers++;
                    else if(spearmen - lostSpearmen > 0) lostSpearmen++;
                    else if(swordsmen - lostSwordsmen > 0) lostSwordsmen++;
                }
                else{
                    if(spearmen - lostSpearmen > 0) lostSpearmen++;
                    else if(archers - lostArchers > 0) lostArchers ++;
                    else if(swordsmen - lostSwordsmen > 0 && Math.random() > .5) lostSwordsmen ++;
                }
            }
            spearmen -= lostSpearmen;
            swordsmen -= lostSwordsmen;
            archers -= lostArchers;
            enemyPower = 0;
        }

        if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) > 0){
            attackMessage += "You were attacked by a band of " + enemyOrcs + " orcs and " + pluralize(enemyOgres, "ogre") + ".^^Your armies successfully defended against the attack, but you lost " + lostSpearmen + " spearmen, " + lostSwordsmen + " swordsmen, and " + pluralize(lostArchers, "archer") + ".^^";
        }
        else if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) == 0){
            attackMessage += "You were attacked by a band of " + enemyOrcs + " orcs and " + pluralize(enemyOgres, "ogre") + ".^^Your armies successfully defended against the attack and you lost no troops.^^";
        }
        else{
            var goldStolen = Math.min(gold,Math.round(enemyPower / 10 * 3));
            var ironStolen = Math.min(iron,Math.round(enemyPower / 10 * 2));
            var vinesStolen = Math.min(vines,Math.round(enemyPower / 10 * 2));
            var woodStolen = Math.min(wood,Math.round(enemyPower / 10 * 1));
            var stoneStolen = Math.min(stone,Math.round(enemyPower / 10 * 1));
            var foodStolen = Math.min(food,Math.round(enemyPower / 10 * 1));

            gold -= goldStolen;
            iron -= ironStolen;
            vines -= vinesStolen;
            wood -= woodStolen;
            stone -= stoneStolen;
            food -= foodStolen;

            attackMessage += "You were attacked by a band of " + enemyOrcs + " orcs and " + pluralize(enemyOgres, "ogre") + ".^^The attacking army wiped out your troops and raided your stockpile. They made off with these resources:^^Gold: " + goldStolen + "^Food: " + foodStolen + "^Iron: " + ironStolen + "^Vines: " + vinesStolen + "^Stone: " + stoneStolen + "^Wood: " + woodStolen + "^^";
        }
    }
    return attackMessage;
}

function goScouting() {
	if (time > 60) {
        write("It's too late to scout for enemy camps.^^What would you like to do next?");
        return;
    }
    if(scouts == 0) {
        write("You do not have any scouts. Train some at the barracks to scout for enemy camps.^^What would you like to do next?");
        return;
    }
    write("How many scouts would you like to send?");
    nextFunction = processScoutingCount;
}

function processScoutingCount() {
	if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled scouting.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var deployedScouts = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(deployedScouts)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }
	if(deployedScouts > scouts) {
		write("You do not have that many scouts.^^How many scouts would you like to send?");
		document.getElementById('inputTextBox').value = "";
		return;
	}
	
	var scoutMessage = "";
	var successChance = Math.random() + deployedScouts * .05;
	if(successChance > 1) {
		scoutMessage += "Your scouts did not find any enemy camps and have returned safely.";
	}
	else {
		identifiedCamps.push(new EnemyCamp(
			//(id, level, visbilityLevel, orcs, ogres, slingers, gold, iron, vines, stone, wood, food)
			identifiedCamps[identifiedCamps.length - 1].id + 1,	//id -- need to check if this is null for the first camp
			Math.ceil((successChance - 1) * 10),				//level
			2,													//visibilityLevel -- need to calculate how to tell the player the camp info
			Math.random(),										//orcs -- need to calculate orcs based on level
			Math.random(),										//ogres -- need to calculate ogres based on level
			Math.random(),										//slingers -- need to calculate slingers based on level
			Math.random(),										//gold -- need to calculate gold based on level
			Math.random(),										//iron -- need to calculate iron based on level
			Math.random(),										//vines -- need to calculate vines based on level
			Math.random(),										//stone -- need to calculate stone based on level
			Math.random(),										//wood -- need to calculate wood based on level
			Math.random()										//food -- need to calculate food based on level
		));
		//need to add scouts losses
		scoutMessage += "Your scouts identified a level x camp with y enemies and z resourcs.";
	}
	
	write(scoutMessage);
	
}