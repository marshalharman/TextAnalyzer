//load a file from disk
function loadfile(filename,displayName){
    // console.log(displayName);
    let currentfile = "";
    let url = "files/" + filename;

    //reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    // server request to load file
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true );
    xhr.send();

    xhr.onreadystatechange = function(){ 
        if( xhr.readyState == 4 && xhr.status == 200){
            currentFile = xhr.responseText;
            
            getDocStats(currentFile);

            //remove line breaks and carriage returns and replace with a <br>
            currentFile = currentFile.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentFile;
    

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        } 
    };
}

function getDocStats(fileContent){
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};
    

    var uncommonWords = [];
  
    //filter uncommon words

    uncommonWords = filterStopWords(wordArray);

    

    // count every word in the WordArray
    for( let word in uncommonWords){
        let wordValue = uncommonWords[word];
        if(wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1;
        }
        else {
            wordDictionary[wordValue] = 1;
        }
    }
    //sort
    let wordList = sortProperties(wordDictionary);

    //Return top 5 words
    var top5Words = wordList.slice(0,6);
    var least5Words = wordList.slice(-6,wordList.length);

    //write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));


    docLength.innerText = "Document Length:" + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;


}

function ULTemplate(items,element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i=0; i<items.length-1; i++){
        resultsHTML += templateHTML.replace('{{val}}',items[i][0] + " : " + items[i][1] +" time(s)");
    }

    element.innerHTML = resultsHTML;
}

function sortProperties(obj){
    //first convert obj to array
    let rtnArray = Object.entries(obj);

    //sorting
    rtnArray.sort(function (first,second){
        return second[1] - first[1];
    });

    return rtnArray;
}

//filter out stop words
function filterStopWords(wordArray){
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    for( i=0; i<commonWords.length; i++){
        commonObj[commonWords[i].trim()] = true;
    }

    for (i=0;i<wordArray.length;i++){
        word = wordArray[i].trim().toLowerCase();
        if(!commonObj[word]){
            uncommonArr.push(word);
        }
    }

    return uncommonArr; 
}


function getStopWords(){
    return ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']

}

// highlight the words in search
function performMark(){

    //read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    //find all the currently marked items
    let spans = document.querySelectorAll('mark');
    
    for( var i =0; i< spans.length; i++){     //converts <mark>ABCD</mark> to ABCD 
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi");    // global and case insensitive
    var replaceText = "<mark id='markme' style='background-color: orange' >$&</mark>";
    var fileContent = display.innerHTML;

    // mark the elements in file content
    newContent = fileContent.replace(re,replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if(count > 0){
        var element = document.getElementById("markme");
        element.scrollIntoView(); // scrolls to the first marked element
    }
}