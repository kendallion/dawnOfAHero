var writing = false;
function write(text) {
//let text = document.getElementById("inputTextBox").innerHTML;
    if(writing) return;
    writing = true;
    var i = 0;
    var speed = 20;
    document.getElementById('content').innerHTML += '<br>';
    document.getElementById('content').innerHTML += '<br>';

    var timer=setInterval(function(){
        if(i<text.length) {
            if(text.charAt(i) == '^') {
                document.getElementById("content").innerHTML += '<br>';
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
            writing = false;
        }
    },speed)
}

function init(){
    //write("It's a war torn land. Villages are being raided every day by the elusive Woodland Prowlers. Every day, more and more of them arrive. Every day, more and more villagers die. They need a leader. A hero. This hero... is You!^Welcome to our village. My name is Andor. We have been raided by the Woodland Prowlers. We have a small militia left and some resources, but not many. Please help us. I am giving you control of the village.^You can build new buildings, hire workers, train soldiers, and gather materials.");
}

var idlePeasants = 0;
var stone = 0;

function processInput(){
    if(writing) return;

    switch(document.getElementById('inputTextBox').value) {
        case 'h':
        case 'H':
            write("Yeah, you look like you'd need help.");
            break;
        case 'p':
            idlePeasants += 1;
            document.getElementById('idlePeasants').textContent = idlePeasants;
            break;
        case 'm':
            goMining();
            break;
        default:
            write("Not a valid input!!");
    }

    document.getElementById('inputTextBox').value = "";
    /*input = document.getElementById('inputTextBox').value;
    write(input);*/

}

function goMining(){
    var stoneGet = Math.floor(Math.random() * 30);
    write("You got " + stoneGet + " stone from mining.")
    stone += stoneGet;
    document.getElementById('stone').textContent = stone;
}
