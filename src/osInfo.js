import os from 'os';

export const osInfo = {
    cat() {
        console.log(`CPU architecture: ${os.arch()}`);
    },
    cpu() {
        console.log(`Total number of CPUs: ${os.cpus().length}`);
        os.cpus().forEach((cpu, index) => {
            console.log(`CPU ${index + 1}:\nModel: ${cpu.model}\n Clock Rate: ${(cpu.speed / 1000).toFixed(2)} GHz`);
        });
    },
    eol() {
        console.log(`Default system End-Of-Line (EOL) is: ${JSON.stringify(os.EOL)}`);
    },
    homedir() {
        console.log(`Homedir: ${os.homedir()}`);
    },
    username() {
        console.log(`Username: ${os.userInfo().username}`);
    },
}
