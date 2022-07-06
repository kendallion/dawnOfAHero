//bacon

//TODO:
//Market buy & sell - DONE
//night attacks - DONE
//add lose conditions - DONE
//farm upgrades - DONE
//scouting - DONE
//attacking camps - DONE
//horses & carts
    //get horses from new peasants and scouting
//better help menus
//first few days tutorial
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

var trainItem = {
    name: null,
    variable: null,
    neededItemVariable: null,
    goldCost: null,
    trainTime: null,
    barracksLevel: null
};

function EnemyCamp(id, level, visibilityLevel, orcs, ogres, slingers, gold, iron, vines, stone, wood, food) {
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
var campAction = null;
var selectedCampIndex = null;

//debug
identifiedCamps.push(new EnemyCamp(
    1,	                                    //id
    4,				                        //level
    2, 		                                //visibilityLevel
    5,  	                                //orcs
    3,		                                //ogres
    2,                                      //slingers
    3,		                                //gold
    4,		                                //iron
    5,		                                //vines
    14,		                                //stone
    12,		                                //wood
    3   	                                //food
));

const soldierTypes = ["spearmen", "swordsmen", "archers"];
var soldierTypeIndex = 0;
var friendlyArmy = {
    spearmen: null,
    archers: null,
    archers: null
};

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
var horses;
var horsemen;
var idleCarts;
var mineCarts;
var woodCarts;

//buildings
var blacksmithLevel;
var barracks;
var farm;
var smallHouse;
var largeHouse;
var stockpile;
var market;
var stable;

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
    document.getElementById('horses').textContent = scouts;
    document.getElementById('horsemen').textContent = scouts;

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

    //debug
    food = 500;

    idlePeasants = 4;
    farmers = 1;
    miners = 2;
    woodcutters = 2;
    spearmen = 2;
    swordsmen = 1;
    archers = 0;
	scouts = 0;
    horses = 0;
    horsemen = 0;

    //debug
    spearmen = 100;
    swordsmen = 100;
    archers = 100;
    scouts = 100;

    hoes = 2;
    picks = 1;
    axes = 1;
    spears = 0;
    swords = 0;
    bows = 0;
	daggers = 0;

    blacksmithLevel = 0;
    barracksLevel = 1;
    farm = 0;
    smallHouse = 1;
    largeHouse = 1;
    stable = 0;
    stockpile = 1;
    market = 0;

    //debug
    stockpile = 10;

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
        case 'l':
            listCamps();
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
    write("What would you like to build?^b: Blacksmith^a: Barracks^s: Small House^l: Large House^m: Market^t: Stable^h: Help^c: Cancel");
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
        case 't':
            buildItem = {
                name: "stable",
                variable: "stable",
                woodCost: 150,
                stoneCost: 50,
                ironCost: 10,
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

    if ((buildItem.variable == "blacksmithLevel" && blacksmithLevel > 0) ||
        (buildItem.variable == "barracksLevel" && barracksLevel > 0) ||
        (buildItem.variable == "stable" && stable > 0)) {
            write("You already have a level " + window[buildItem.variable] + " " + buildItem.name + ". To upgrade your " + buildItem.name + ", choose \"upgrade\" (\"u\") at the main menu.^^What would you like to do next?");
            nextFunction = null;
            document.getElementById('inputTextBox').value = "";
            return;
    }

    if(buildItem.variable == market) {
        write("You already have a market.^^What would you like to do next?");
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }

    if(buildItem.woodCost > wood) buildMessage += "Not enough wood.^Required: " + buildItem.woodCost + "^Current: " + wood + "^^";
    if(buildItem.stoneCost > stone) buildMessage += "Not enough stone.^Required: " + buildItem.stoneCost + "^Current: " + stone + "^^";
    if(buildItem.ironCost > iron) buildMessage += "Not enough iron.^Required: " + buildItem.ironCost + "^Current: " + iron + "^^";
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
        case 't':
            upgradeItem = {
                name: "stable",
                variable: "stable",
                woodCost: 100,
                stoneCost: 25,
                ironCost: 5,
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
    if ((upgradeItem.variable == "blacksmithLevel" && blacksmithLevel == 0) ||
        (upgradeItem.variable == "barracksLevel" && barracksLevel == 0) ||
        (upgradeItem.variable == "stable" && stable == 0)) {
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
        default:
            write("Not a valid choice. Please try again.");
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
        default:
            write("Not a valid choice. Please try again.");
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
        default:
            write("Not a valid choice. Please try again.");
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
        attackMessage += fight(false, spearmen, swordsmen, archers, Math.ceil((Math.random() * (day / 2)**1.5) + 2), Math.max(0,Math.ceil((Math.random() * (day / 2)**1.5) - 4)), 0);
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

    //1 in 10 chance scouts get attacked
    if(Math.random() <= .1) {
        var scoutsLost = Math.min(deployedScouts, Math.round((1 / ((Math.ceil(Math.random() * 10)) * 2)) * deployedScouts + 1));
        scouts -= scoutsLost;
        updateResources();
        write("Your scouts were attacked by a band of Woodland Prowlers. You lost " + pluralize(scoutsLost, "scout") + ". Your men did not find a camp.^^What would you like to do next?")
        document.getElementById('inputTextBox').value = "";
        nextFunction = null;
        return;
    }

    var scoutMessage = "";
    var successChance = Math.random() + deployedScouts * .05;
	if(successChance < 1) {
		scoutMessage += "Your scouts did not find any enemy camps and have returned safely.";
	}
	else {
        var campLevel = Math.ceil((successChance - 1) * 10);
		identifiedCamps.push(new EnemyCamp(
			(identifiedCamps.length ? identifiedCamps[identifiedCamps.length - 1].id + 1 : 1),	//id
			campLevel,				                                                            //level
            Math.min(5, Math.ceil(deployedScouts / 5)), 		                                //visibilityLevel
            Math.ceil(Math.random() * campLevel**1.4 + 8),  	                                //orcs
			Math.ceil(Math.random() * campLevel**1.4 + 2),		                                //ogres
			Math.max(0, Math.ceil(Math.random() * campLevel**1.3 - 2)),                         //slingers
			Math.ceil(Math.random() * campLevel**1.2 + 3),		                                //gold
			Math.ceil(Math.random() * campLevel**1.2 + 4),		                                //iron
			Math.ceil(Math.random() * campLevel**1.2 + 4),		                                //vines
            Math.ceil(Math.random() * campLevel**1.3 + 25),		                                //stone
			Math.ceil(Math.random() * campLevel**1.3 + 25),		                                //wood
			Math.ceil(Math.random() * campLevel**1.2)   	                                    //food
		));
		//need to add scouts losses
		scoutMessage += "Your scouts identified a level " + identifiedCamps.slice(-1)[0].level + " camp. Input 'l' to view its stats.";
	}

    scoutMessage += "^^What would you like to do next?";
	write(scoutMessage);
    document.getElementById('inputTextBox').value = "";
    nextFunction = null;
}

function listCamps() {
    if(!identifiedCamps.length) {
        write("You have not identified any camps. Use 'g' to scout the land for enemy camps.^^What would you like to do next?");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    var campMessage = "Identified Camps: ^^";
    identifiedCamps.forEach(camp => {
        if(camp.visibilityLevel == 1) campMessage += "Id: " + camp.id + "^Level: " + camp.level + "^No other information was gathered about this camp.^^";
        else if(camp.visibilityLevel == 2) campMessage += "Id: " + camp.id + "^Level: " + camp.level + "^Enemies: At least " + ( (Math.floor((camp.orcs + camp.ogres + camp.slingers) / 10) * 10) - Math.round(Math.random() * 5) ) + "^Building Materials: At least " + ( (Math.floor((camp.stone + camp.wood) / 10) * 10) - Math.round(Math.random() * 10) ) + "^Resources: At least " + ( (Math.floor((camp.iron + camp.vines + camp.gold + camp.food) / 10) * 10) - Math.round(Math.random() * 5) + "^^");
        else if(camp.visibilityLevel == 3) campMessage += "Id: " + camp.id + "^Level: " + camp.level + "^Enemies: At least " + ( Math.floor((camp.orcs + camp.ogres + camp.slingers) / 5) * 5 ) + "^Building Materials: At least " + ( Math.floor((camp.stone + camp.wood) / 5) * 5 ) + "^Resources: " + ( Math.floor((camp.iron + camp.vines + camp.gold + camp.food) / 5) * 5) + "^^";
        else if(camp.visibilityLevel == 4) campMessage += "Id: " + camp.id + "^Level: " + camp.level + "^Orcs: About " + Math.round(camp.orcs + (Math.random() * 8 - 4)) + "^Ogres: About " + Math.max(0,Math.round(camp.ogres + (Math.random() * 6 - 3))) + "^Slingers: " + Math.max(0,Math.round(camp.slingers + (Math.random() * 4 - 2))) + "^Wood: " + Math.max(0,Math.round(camp.wood + (Math.random() * 10 - 5))) + "^Stone: " + Math.max(0,Math.round(camp.stone + (Math.random() * 10 - 5))) + "^Iron: " + Math.max(0,Math.round(camp.iron + (Math.random() * 4 - 2))) + "^Vines: " + Math.max(0,Math.round(camp.vines + (Math.random() * 4 - 2))) + "^Food: " + Math.max(0,Math.round(camp.food + (Math.random() * 4 - 2))) + "^Gold: " + Math.max(0,Math.round(camp.gold + (Math.random() * 4 - 2))) + "^^";
        else if(camp.visibilityLevel == 5) campMessage += "Id: " + camp.id + "^Level: " + camp.level + "^Orcs: " + camp.orcs + "^Ogres: " + camp.ogres + "^Slingers: " + camp.slingers + "^Wood: " + camp.wood + "^Stone: " + camp.stone + "^Iron: " + camp.iron + "^Vines: " + camp.vines + "^Food: " + camp.food + "^Gold: " + camp.gold + "^^";
    });
    campMessage += "What would you like to do next?^a: Attack a camp^r: Remove a camp from your list^G: Gather resources from a defeated camp^c: Cancel";
    write(campMessage);
    document.getElementById('inputTextBox').value = "";
    nextFunction = chooseCampAction;
}

function chooseCampAction() {
    switch(document.getElementById('inputTextBox').value) {
        case 'a':
            write("Which camp would you like to attack? Select by Id.");
            nextFunction = selectCampAttack;
            break;
        case 'r':
            write("Which camp would you like to remove from your list? Select by ID.");
            nextFunction = selectCampRemoval;
            break;
        case 'g':
            write("Which camp would you like to gather resources from? Select by ID.");
            nextFunction = selectCampGather;
            break;
        case 'c':
            write("Cancelled camp action.^^What would you like to do next?");
            nextFunction = null;
            break;
        default:
            write("Not a valid choice. Please try again.");
            document.getElementById('inputTextBox').value = "";
            return;
    }
    document.getElementById('inputTextBox').value = "";
}

function selectCampAttack(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled camp attack.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var id = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(id)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }
    selectedCampIndex = identifiedCamps.findIndex(camp => camp.id == id);
    if(selectedCampIndex == -1){
        write("You have not identified a camp with that Id. Please try again.");
        document.getElementById('inputTextBox').value = "";
    }
    else if(identifiedCamps[selectedCampIndex].orcs + identifiedCamps[selectedCampIndex].ogres + identifiedCamps[selectedCampIndex].slingers < 1){
        write("You have already defeated this camp, but you can still send your army to gather resources from it.^^How many " + soldierTypes[soldierTypeIndex] + " would you like to send?");
        document.getElementById('inputTextBox').value = "";
        campAction = "gather";
        nextFunction = sendArmyToCamp;
    }
    else{
        write("How many " + soldierTypes[soldierTypeIndex] + " would you like to send?");
        document.getElementById('inputTextBox').value = "";
        campAction = "attack";
        nextFunction = sendArmyToCamp;
    }
}

function selectCampGather(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled resource gathering.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var id = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(id)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }
    selectedCampIndex = identifiedCamps.findIndex(camp => camp.id == id);
    if(selectedCampIndex == -1){
        write("You have not identified a camp with that Id. Please try again.");
        document.getElementById('inputTextBox').value = "";
    }
    else if(identifiedCamps[selectedCampIndex].orcs + identifiedCamps[selectedCampIndex].ogres + identifiedCamps[selectedCampIndex].slingers > 0){
        write("You have not yet defeated this camp. You must select a camp you have already attacked and defeated.");
        document.getElementById('inputTextBox').value = "";
    }
    else{
        write("How many " + soldierTypes[soldierTypeIndex] + " would you like to send to gather resources?");
        document.getElementById('inputTextBox').value = "";
        campAction = "gather";
        nextFunction = sendArmyToCamp;
    }
}

function sendArmyToCamp(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled camp action.^^What would you like to do next?")
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
    if(count > window[soldierTypes[soldierTypeIndex]]){
        write("You do not have that many " + soldierTypes[soldierTypeIndex] + ".");
        document.getElementById('inputTextBox').value = "";
        return;
    }

    friendlyArmy[soldierTypes[soldierTypeIndex]] = count;
    document.getElementById('inputTextBox').value = "";

    if(soldierTypeIndex < soldierTypes.length - 1) {
        soldierTypeIndex ++;
        write("How many " + soldierTypes[soldierTypeIndex] + " would you like to send?");
        return;
    }
    else {
        if(campAction == "attack") write("Your army marches to the camp... ^^" + fight(true, friendlyArmy.spearmen, friendlyArmy.swordsmen, friendlyArmy.archers, identifiedCamps[selectedCampIndex].orcs, identifiedCamps[selectedCampIndex].ogres, identifiedCamps[selectedCampIndex].slingers));
        else write(gatherCampResources(friendlyArmy.spearmen, friendlyArmy.swordsmen, friendlyArmy.archers))
    }

    nextFunction = null;
    soldierTypeIndex = 0;
    friendlyArmy = {
        spearmen: null,
        swordsmen: null,
        arhcers: null
    };
}

function fight(playerOffense, deployedSpearmen, deployedSwordsmen, deployedArchers, deployedOrcs, deployedOgres, deployedSlingers){
    var fightMessage = "";
    var enemyPower = deployedOrcs + deployedOgres * 2 + deployedSlingers / 2;
    var friendlyPower = deployedSpearmen + deployedSwordsmen * 2 + deployedArchers / 2;
    console.log("Friendly Power: " + friendlyPower + "\nEnemy Power: " + enemyPower);
    var lostSpearmen = 0;
    var lostSwordsmen = 0;
    var lostArchers = 0;
    var lostOrcs = 0;
    var lostOgres = 0;
    var lostSlingers = 0;
    var camp = identifiedCamps[selectedCampIndex];

    //calculate ranged attacks
    if(playerOffense) {
        friendlyPower -= Math.ceil(deployedSlingers * (Math.random() * .10 + .25));
        enemyPower -= Math.ceil(deployedArchers * (Math.random() * .05 + .25));
    }
    else {
        enemyPower -= Math.ceil(deployedArchers * (Math.random() * .15 + .25));
        friendlyPower -= Math.ceil(deployedSlingers * (Math.random() * .05 + .15));
    }
    console.log("Friendly Power: " + friendlyPower + "\nEnemy Power: " + enemyPower);
    console.log("Spearmen: " + deployedSpearmen + "\nSwordsmen: " + deployedSwordsmen + "\nArchers:" + deployedArchers);

    //if the enemy wins
    if(enemyPower > friendlyPower){
        friendlyPower -= ((enemyPower - friendlyPower) / 10);
        for(var i=1;i<friendlyPower;i++){
            if(i % 3 == 0){
                if(deployedOgres - lostOgres > 0) lostOgres++;
                else if(deployedOrcs - lostOrcs > 0) lostOrcs++;
                else if(deployedSlingers - lostSlingers > 0) lostSlingers++;
            }
            else if(i % 5 == 0){
                if(deployedSlingers - lostSlingers > 0) lostSlingers++;
                else if(deployedOrcs - lostOrcs > 0) lostOrcs++;
                else if(deployedOgres - lostOgres > 0) lostOgres++;
            }
            else{
                if(deployedOrcs - lostOrcs > 0) lostOrcs++;
                else if(deployedSlingers - lostSlingers > 0) lostSlingers ++;
                else if(deployedOgres - lostOgres > 0 && Math.random() > .7) lostOgres ++;
            }
        }
        if(playerOffense) {
            camp.orcs -= lostOrcs;
            camp.ogres -= lostOgres;
            camp.slingers -= lostSlingers;
        }
        enemyPower = max(1, enemyPower - lostOrcs - lostOgres * 2 - lostSlingers / 2);

        spearmen -= deployedSpearmen;
        swordsmen -= deployedSwordsmen;
        archers -= deployedArchers;
        friendlyPower = 0;
    }
    //else if the player wins
    else {
        enemyPower -= ((friendlyPower - enemyPower) / 10);
        console.log("Friendly Power: " + friendlyPower + "\nEnemy Power: " + enemyPower);
        for(var i=1;i<enemyPower;i++){
            if(i % 3 == 0){
                if(deployedSwordsmen - lostSwordsmen > 0) lostSwordsmen++;
                else if(deployedSpearmen - lostSpearmen > 0) lostSpearmen++;
                else if(deployedArchers - lostArchers > 0 && Math.random() > .2) lostArchers++;
            }
            else if(i % 5 == 0){
                if(deployedArchers - lostArchers > 0) lostArchers++;
                else if(deployedSpearmen - lostSpearmen > 0 && Math.random() > .2) lostSpearmen++;
                else if(deployedSwordsmen - lostSwordsmen > 0 && Math.random() > .4) lostSwordsmen++;
            }
            else{
                if(deployedSpearmen - lostSpearmen > 0 && Math.random() > .2) lostSpearmen++;
                else if(deployedArchers - lostArchers > 0 && Math.random() > .4) lostArchers ++;
                else if(deployedSwordsmen - lostSwordsmen > 0 && Math.random() > .8) lostSwordsmen ++;
            }
        }
        deployedSpearmen -= lostSpearmen;
        deployedSwordsmen -= lostSwordsmen;
        deployedArchers -= lostArchers;

        spearmen -= lostSpearmen;
        swordsmen -= lostSwordsmen;
        archers -= lostArchers;
        friendlyPower = friendlyPower - lostSpearmen - lostSwordsmen * 2 - lostArchers / 2;
        enemyPower = 0;
        if(playerOffense) {
            camp.orcs = 0;
            camp.ogres = 0;
            camp.slingers = 0;
        }
    }

    //calculate all resources down here
    if(playerOffense) { //player attacks a camp
        var victory;
        if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) > 0){
            fightMessage += "Your army successfully destroyed the camp, but you lost " + pluralize(lostSpearmen, "spearman") + ", " + pluralize(lostSwordsmen, "swordsman") + ", and " + pluralize(lostArchers, "archer") + ".^^";
            victory = true;
        }
        else if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) == 0){
            fightMessage += "Your army successfully destroyed the camp and you lost no troops.^^";
            victory = true;
        }
        else{
            victory = false;
            fightMessage += "Your army was defeated by the camp. You were able to kill " + pluralize(lostOrcs, "orc") + ", " + pluralize(lostOgres, "ogre") + ", and " + pluralize(lostSlingers, "slinger") + ".^^";
            if(camp.visibilityLevel < 5) camp.visibilityLevel ++;
        }

        if(victory){
            fightMessage += (gatherCampResources(deployedSpearmen + deployedSwordsmen + deployedArchers));
        }
    }
    else { //player is attacked
        if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) > 0){
            fightMessage += "You were attacked by a band of " + deployedOrcs + " orcs and " + pluralize(deployedOgres, "ogre") + ".^^Your army successfully defended against the attack, but you lost " + lostSpearmen + " spearmen, " + lostSwordsmen + " swordsmen, and " + pluralize(lostArchers, "archer") + ".^^";
        }
        else if(enemyPower == 0 && (lostSpearmen + lostSwordsmen + lostArchers) == 0){
            fightMessage += "You were attacked by a band of " + deployedOrcs + " orcs and " + pluralize(deployedOgres, "ogre") + ".^^Your army successfully defended against the attack and you lost no troops.^^";
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

            fightMessage += "You were attacked by a band of " + deployedOrcs + " orcs and " + pluralize(deployedOgres, "ogre") + ".^^The attacking army wiped out your troops and raided your stockpile. They made off with these resources:^^Gold: " + goldStolen + "^Food: " + foodStolen + "^Iron: " + ironStolen + "^Vines: " + vinesStolen + "^Stone: " + stoneStolen + "^Wood: " + woodStolen + "^^";
        }
    }
    updateResources();
    if(playerOffense) fightMessage += "What would you like to do next?";
    return fightMessage;
}

function selectCampRemoval(){
    if(document.getElementById('inputTextBox').value == 'c'){
        write("Cancelled camp removal.^^What would you like to do next?")
        nextFunction = null;
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var id = parseInt(document.getElementById('inputTextBox').value);
    if(isNaN(id)){
        write("Please input a number.");
        document.getElementById('inputTextBox').value = "";
        return;
    }
    var index = identifiedCamps.findIndex(camp => camp.id == id);
    if(index == -1){
        write("You have not identified a camp with that Id. Please try again.");
        document.getElementById('inputTextBox').value = "";
    }
    else{
        identifiedCamps.splice(index, 1);
        write("Removed camp of Id " + id + ". ^^What would you like to do next?^a: Attack a camp^r: Remove a camp from your list^c: Cancel");
        document.getElementById('inputTextBox').value = "";
        nextFunction = chooseCampAction;
    }
}

function gatherCampResources(carryCapacity){
    var gatherMessage = "";
    var camp = identifiedCamps[selectedCampIndex];

    var foodStolen = camp.food;
    var goldStolen = camp.gold;
    var ironStolen = camp.iron;
    var vinesStolen = camp.vines;
    var woodStolen = camp.wood;
    var stoneStolen = camp.stone;

    var maxCarry = Math.round(Math.min(carryCapacity, storageLeft()));
    var totalStolen = 0;

    if(totalStolen + camp.food > maxCarry) foodStolen = maxCarry - totalStolen;
    totalStolen += foodStolen;
    if(totalStolen + camp.gold > maxCarry) goldStolen = maxCarry - totalStolen;
    totalStolen += goldStolen;
    if(totalStolen + camp.iron > maxCarry) ironStolen = maxCarry - totalStolen;
    totalStolen += ironStolen;
    if(totalStolen + camp.vines > maxCarry) vinesStolen = maxCarry - totalStolen;
    totalStolen += vinesStolen;
    if(totalStolen + camp.wood > maxCarry) woodStolen = maxCarry - totalStolen;
    totalStolen += woodStolen;
    if(totalStolen + camp.stone > maxCarry) stoneStolen = maxCarry - totalStolen;
    totalStolen += stoneStolen;

    camp.gold -= goldStolen;
    camp.iron -= ironStolen;
    camp.vines -= vinesStolen;
    camp.wood -= woodStolen;
    camp.stone -= stoneStolen;
    camp.food -= foodStolen;

    gold += goldStolen;
    iron += ironStolen;
    vines += vinesStolen;
    wood += woodStolen;
    stone += stoneStolen;
    food += foodStolen;

    gatherMessage += "Your army gathered these resources:^^Gold: " + goldStolen + "^Food: " + foodStolen + "^Iron: " + ironStolen + "^Vines: " + vinesStolen + "^Stone: " + stoneStolen + "^Wood: " + woodStolen + "^^";
    if(camp.gold + camp.iron + camp.vines + camp.wood + camp.stone + camp.food > 0) {
        gatherMessage += "Your army was not able to carry away all of the camp's resources. The camp is still in your list and you can go back to gather the resources at any time.^^";
        camp.visibilityLevel = 5;
    }
    else {
        gatherMessage += "Your army gathered all the resources from the camp, and the camp has been removed from your list.^^";
        identifiedCamps.splice(selectedCampIndex, 1);
    }
    return gatherMessage;
}
