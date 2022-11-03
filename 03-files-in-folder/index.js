const path = require('path');
const fs = require('fs');

function showDir () {
    const pathToDir = path.join(__dirname, 'secret-folder');
    let filesArray;

    fs.readdir(pathToDir,  { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        filesArray = files;
        for (let i = 0; i < filesArray.length; i++) {
            if (filesArray[i].isFile()) {
                let string = '';
                let nameArray = filesArray[i].name.split('.');

                let pathToFile = path.join(__dirname, `secret-folder/${filesArray[i].name}`);
                let sizeInByte;

                fs.stat(pathToFile, function(err, stats) {
                    sizeInByte = stats.size;
                    sizeInKb = sizeInByte / 1000;

                    string += nameArray[0] + ' - ' + nameArray[1] + ' - ' + sizeInKb + 'kb';
                    console.log(string);
                })
            }
        }
    })
}

showDir()