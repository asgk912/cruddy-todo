const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileName = path.join(exports.dataDir, `${id}.txt`);

    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error writing a new file of new todo');
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error in readAll files');
    } else {
      var data = [];

      // files.forEach((fileName) => {
      //   var id = fileName.substring(0, fileName.length - 4);

      //   fs.readFile(exports.dataDir + fileName, (err, txt) => {
      //     if (err) {
      //       throw ('error individual file in readAll');
      //     } else {
      //       // console.log('fs read in readdir', txt);
      //       console.log({id, txt});
      //       data.push({id, txt});
      //     }
      //   });
      // });

      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }


  // create directory for file
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  // read the file
  fs.readFile(fileName, (err, fileData) => {
    // if file is not present, we have error, so throw an error
    if (err) {
      throw ('error reading file while in update');
    // if file is present, update the file with text
    } else {
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          throw ('error writing file while in update');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
