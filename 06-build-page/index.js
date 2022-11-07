const path = require('path');
const fs = require('fs');

function createDir (pathToDir) {
    const fsPromises = fs.promises;
    fsPromises.mkdir(pathToDir, { recursive: true });
    // clearDir(pathToDir);
}

function clearDir (pathToDir) {
    let newDirArrray;

    fs.readdir(pathToDir,  { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        newDirArrray = files;

        for (let i = 0; i < newDirArrray.length; i++ ) {
            if (newDirArrray[i].isFile()) {
                let currentFile = path.join(pathToDir, newDirArrray[i].name );
                fs.unlink(currentFile, err => {
                    if(err) throw err;
                });
            }
        }
    })
}


function createFile(fileName, dirPath) {
    const filePath = path.join(dirPath, fileName);
    fs.writeFile(
        filePath, '',
        (err) => {
            if (err) throw err;
        }
    )
}


function findAndWriteFile (oldFile, newFile, extension) {
    let filesArray;

    fs.readdir(oldFile,  { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        filesArray = files;

        for (let i = 0; i < filesArray.length; i++) {
            if (filesArray[i].isFile() && filesArray[i].name.split('.')[1] === extension) {
                const currentFile = path.join(oldFile, filesArray[i].name);

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


function copyFile (oldFile, newFile) { 
    let data = '';
    const rstream = fs.createReadStream(oldFile);
    rstream.on('data', chunk => data += chunk);
    rstream.on('end', () => {
        
        let writableStream = fs.createWriteStream(newFile);
        writableStream.write(data);
        writableStream.end();
          
        writableStream.on('finish', () => {
            replaceComponents();
        })
    })
}


function replaceComponents () {
    let pathToNewHtml = path.join(__dirname, 'project-dist', 'index.html');
    let pathToComponents = path.join(__dirname, 'components');

    fs.readFile(pathToNewHtml, 'utf8', function(error, fileContent){
        if(error) throw error;
        
        fs.readdir(pathToComponents,  { withFileTypes: true }, (err, files) => {
            if (err) throw err;
            let componentsArray = files;
            for (let i = 0; i < componentsArray.length; i++) {
                if (componentsArray[i].isFile() && componentsArray[i].name.split('.')[1] === 'html') {
                    let component = `${componentsArray[i].name.split('.')[0]}`;
                    let pathToComponent = path.join(__dirname, 'components', componentsArray[i].name);
                    fs.readFile(pathToComponent, 'utf8', function(error, componentContent) {
                        if(error) throw error;
                        fileContent = fileContent.replace(new RegExp(`{{${component}}}`, 'g'), componentContent)

                        fs.writeFile(pathToNewHtml, fileContent, function(error){
                            if(error) throw error;
                        });
                    })
                }
            }
        })
    })
}


function copyDirectory (oldDir, newDir) {
    let filesArray;

    fs.readdir(oldDir,  { withFileTypes: true }, (err, files) => {

        if (err) throw err;
        filesArray = files;
        for (let i = 0; i < filesArray.length; i++) {
            if (filesArray[i].isFile()) {
                let currentFile = filesArray[i].name;
                createFile(currentFile, newDir);

                let pathNewFile = path.join(newDir, filesArray[i].name);
                let pathOldFile = path.join(oldDir, filesArray[i].name);
                
                fs.copyFile(pathOldFile, pathNewFile, err => {
                    if(err) throw err;
                });
            } else {
                createDir(path.join(newDir, `${filesArray[i].name}`));
                copyDirectory (path.join(oldDir, `${filesArray[i].name}`), path.join(newDir, `${filesArray[i].name}`))
            }
        }
    })
}


(function () {
    createDir(path.join(__dirname, 'project-dist'));
    newDir = path.join(__dirname, 'project-dist');
    createFile('index.html', newDir);
    createFile('style.css', newDir);
    createDir(path.join(__dirname, 'project-dist', 'assets'));
    oldHtml = path.join(__dirname, 'template.html');
    newHtml = path.join(__dirname, 'project-dist', 'index.html')
    copyFile(oldHtml, newHtml);
    findAndWriteFile(path.join(__dirname, 'styles'), path.join(newDir, 'style.css'), 'css');
    oldAssets = path.join(__dirname, 'assets');
    newAssets = path.join(newDir, 'assets');
    copyDirectory (oldAssets, newAssets);
}())



