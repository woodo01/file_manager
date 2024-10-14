import readline from "readline";
import {helper} from "./helper.js";
import { cwd } from 'process';
import {navigation} from "./navigation.js";

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
                    case '.exit':
                        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
                        readLineInterface.close();
                        return;
                    default:
                        console.log('Invalid input');
                }
            } catch (error) {
                console.error('Operation failed');
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
