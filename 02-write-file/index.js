const path = require('path');
const fs = require('fs');

function writeFile () {
    const textPath = path.join(__dirname, 'text.txt');

    fs.writeFile(
        textPath, '',
        (err) => {
            if (err) throw err;
    }
    )

    const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

    const { stdin, stdout } = process;
    stdout.write('Привет! Напиши мне что-нибудь!\n');

    stdin.on('data', chunk => {
        if (chunk.toString().trim()!=='exit') {
            output.write(chunk);
        } else {
            stdout.write('Отличного дня :)\n');
            process.exit();
        }
    })

    process.on('SIGINT', () => {
        stdout.write('Отличного дня :)\n');
        process.exit();
    });
}

writeFile ()
