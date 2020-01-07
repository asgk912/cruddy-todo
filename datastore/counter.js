const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      console.log(`at Read Callback(0): ${callback(null, 0)}`);
      callback(null, 0);
    } else {
      console.log(`at Read Callback(#): ${callback(null, Number(fileData))}`);
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      // console.log(`at Write Callback: ${callback(null, counterString)}`);
      return callback(null, counterString);
      // console.log(`Return within Callback of writeCounter: ${counterString}`);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  // read the file and get the counter
  readCounter((err, currentCounter) => {
    // increment counter by 1
    counter = currentCounter + 1;
    // write it to the file
    return writeCounter(counter, (err, counterString) => {
      // return the counter value
      // console.log(`Return within Callback of writeCounter: ${counterString}`);
      return counterString;
    });
  });
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
