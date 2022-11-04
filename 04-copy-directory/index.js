const path = require('path');
const fs = require('fs');


function createDir (dirName) {
    const pathToDir = path.join(__dirname, `${dirName}`);
    const fsPromises = fs.promises;
    fsPromises.mkdir(pathToDir, { recursive: true });
    clearDir();
}


function createFile(fileName, dirName) {
    const filePath = path.join(`${dirName}`, `${fileName}`);
    fs.writeFile(
        filePath, '',
        (err) => {
            if (err) throw err;
        }
    )
}


function clearDir () {
    const newDir = path.join(__dirname, 'files-copy'); 
    let newDirArrray;

    fs.readdir(newDir,  { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        newDirArrray = files;

        for (let i = 0; i < newDirArrray.length; i++ ) {
            let currentFile = path.join(newDir, newDirArrray[i].name )
            fs.unlink(currentFile, err => {
                if(err) throw err; // не удалось удалить файл
            });
        }
    })
}


function copyDirectory () {
    createDir('files-copy');

    const oldDir = path.join(__dirname, 'files');
    let filesArray;

    fs.readdir(oldDir,  { withFileTypes: true }, (err, files) => {
        const newDir = path.join(__dirname, 'files-copy');

        if (err) throw err;
        filesArray = files;
        for (let i = 0; i < filesArray.length; i++) {
            if (filesArray[i].isFile()) {
                let currentFile = filesArray[i].name;
                createFile(currentFile, newDir);

                let pathNewFile = path.join(newDir, filesArray[i].name);
                let pathOldFile = path.join(oldDir, filesArray[i].name);
                
                fs.copyFile(pathOldFile, pathNewFile, err => {
                    if(err) throw err; // не удалось скопировать файл
                });
            } else {
                
            }
        }
    })
    // comparisonDir ()
}

copyDirectory()
