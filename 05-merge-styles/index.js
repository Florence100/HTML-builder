const path = require('path');
const fs = require('fs');


function createFile(fileName, pathToFile) {
    const newFile = path.join(pathToFile, fileName);
    fs.writeFile(
        newFile, '',
        (err) => {
            if (err) throw err;
        }
    )
}

function findAndWriteCss () {
    const dirName = path.join(__dirname, 'styles');
    let filesArray;
    cssArray = [];

    fs.readdir(dirName,  { withFileTypes: true }, (err, files) => {

        if (err) throw err;
        filesArray = files;

        for (let i = 0; i < filesArray.length; i++) {
            if (filesArray[i].isFile() && filesArray[i].name.split('.')[1] === 'css') { // файлы с расширением css
                const currentFile = path.join(dirName, filesArray[i].name);
                const newFile = path.join(__dirname, 'project-dist', 'bundle.css');

                let data = '';
                const rstream = fs.createReadStream(currentFile);
                rstream.on('data', chunk => data += chunk);
                rstream.on('end', () => {
                    fs.appendFile(newFile, data, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                    })
                    fs.appendFile(newFile, '\n', (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                    })
                })
            }
        }
    })
}


function mergeStyles() {
    pathToFile = path.join(__dirname, 'project-dist');
    createFile('bundle.css', pathToFile);
    findAndWriteCss();
}

mergeStyles();


