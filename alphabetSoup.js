const fs = require("fs");

//Define usage
if (process.argv.length < 3) {
  console.log("CLI Usage: node alphabetSoup.js <Filename.fileExtension>");
  process.exit(1);
}

//Define file name base on CLI input
let fileName = process.argv[2];

//Read file and pase data for parse
fs.readFile(fileName, "utf8", (err, data) => {
  if (err) throw err;
  parseFile(data);
});

//parse data into more manageable elements
function parseFile(data) {
  //split data into rows of data array
  let dataArray = data.split("\n");

  //remove any line break and spaces in row data: \r \r\n \n " ", but keeps all characters
  for (let rowData in dataArray) {
    dataArray[rowData] = dataArray[rowData].replace(/\s/g, "");
  }

  //find data line 0 and split by "x" and change to interger: this is the grid space x and y
  let [gridX, gridY] = dataArray[0].split("x").map(Number);

  //create a array of an array of the grid: ie: [[],[],[]]
  let wordGrid = dataArray.slice(1, gridY + 1);

  //create a array matching the order of input for result formatting
  let resultOrder = [];

  //create a array to capture the unsorted result return from searchGrid and searchDirection
  let unsortedResult = [];

  //create a hashmap of words from the data aray to be searched
  //structure: wordFirstChar => [array of words]
  let wordMap = new Map();
  for (let word of dataArray.slice(gridY + 1)) {
    resultOrder.push(word);

    if (wordMap.has(word[0])) {
      wordMap.get(word[0]).push(word);
    } else {
      wordMap.set(word[0], [word]);
    }
  }

  //initiate a grid search and then directional search starting from 0,0 to highest grid value
  searchGrid(gridX, gridY, wordGrid, wordMap, unsortedResult);

  //format the return unsorted result to match input data
  for (let order of resultOrder) {
    for (let element of unsortedResult) {
      if (element.split(" ")[0] == order) {
        console.log(element);
      }
    }
  }
}

//search grid function that takes max of x and y, word-grid, hashmap of words and reference to unsorted result array
function searchGrid(maxX, maxY, wordGrid, wordMap, unsortedResult) {
  //direction of search
  const direction = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ];

  //search 8 directions for every char in the word grid array that matches the first letter of the word, else skip it
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      //when word grid array match word by first letter
      if (wordMap.has(wordGrid[y][x])) {
        //pass in the array of all words that match by first letter
        let wordArray = wordMap.get(wordGrid[y][x]);
        //for every word in the match array search all 8 directions with function searchDirection
        for (let word of wordArray) {
          for (let path of direction) {
            let endPoint = searchDirection(path, x, y, word, wordGrid);
            if (endPoint) {
              //if word exists, add to the unsorted result array
              unsortedResult.push(`${word} ${x}:${y} ${endPoint}`);
            }
          }
        }
      }
    }
  }
}

function searchDirection(path, x, y, word, wordGrid, i = 1) {
  //if i itteration length matches word length, word exists, return the end point on word grid
  if (i == word.length) {
    return x + ":" + y;
  }

  //Step in the direction of current itteration
  xd = path[0] + x;
  yd = path[1] + y;

  //break out of all invalid steps
  if (xd < 0 || xd >= wordGrid[0].length || yd < 0 || yd >= wordGrid.length) {
    return;
  }

  //increase itteration count when next letter matches
  if (wordGrid[yd][xd] == word[i]) {
    return searchDirection(path, xd, yd, word, wordGrid, i + 1);
  }
}
