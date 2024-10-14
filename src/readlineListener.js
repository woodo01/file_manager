import readline from "readline";
import {helper} from "./helper.js";
import { cwd } from 'process';
import {navigation} from "./navigation.js";
import {osInfo} from "./osInfo.js";
import {file} from "./file.js";
import {hash} from "./hash.js";
import {compress} from "./compress.js";

function echoLocation() {
    return `You are currently in ${cwd()}\n>`;
}

export const readlineListener = {
    currentDir: undefined,
    username: undefined,

    init(username) {
        this.currentDir = cwd();
        this.username = username;

        return readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `You are currently in ${this.currentDir}\n> `,
        });
    },
    listen(username) {
        const readLineInterface = this.init(username);
        readLineInterface.prompt();

        readLineInterface.on('line', async (input) => {
            const [command, ...params] = input.trim().split(' ');

            try {
                switch (command) {
                    case 'help':
                        helper();
                        break;
                    case 'up':
                        await navigation.up()
                        break;
                    case 'cd':
                        await navigation.cd(params[0])
                        break;
                    case 'ls':
                        await navigation.ls()
                        break;
                    case 'os':
                        switch (params[0]) {
                            case '--architecture':
                                osInfo.arch();
                                break;
                            case '--cpus':
                                osInfo.cpu();
                                break;
                            case '--EOL':
                                osInfo.eol();
                                break;
                            case '--homedir':
                                osInfo.homedir();
                                break;
                            case '--username':
                                osInfo.username();
                                break;
                            default:
                                console.log('Invalid input');
                        }
                        break;
                    case 'cat':
                        await file.cat(params[0]);
                        break;
                    case 'add':
                        await file.add(params[0]);
                        break;
                    case 'rn':
                        await file.rn(params[0], params[1]);
                        break;
                    case 'cp':
                        await file.cp(params[0], params[1]);
                        break;
                    case 'mv':
                        await file.mv(params[0], params[1]);
                        break;
                    case 'rm':
                        await file.rm(params[0]);
                        break;
                    case 'hash':
                        await hash(params[0]);
                        break;
                    case 'compress':
                        await compress.compressFile(params[0], params[1]);
                        break;
                    case 'decompress':
                        await compress.decompressFile(params[0], params[1]);
                        break;
                    case '.exit':
                        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
                        readLineInterface.close();
                        return;
                    default:
                        console.log('Invalid input');
                }
            } catch (error) {
                console.error('Operation failed: ' + error);
            }

            readLineInterface.setPrompt(echoLocation());
            readLineInterface.prompt();
        });

        readLineInterface.on('close', () => {
            console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
            process.exit(0);
        });
    }
};
