const session =  {
    start: () => {
        const args = process.argv.slice(2);
        const username =
            args.find((arg) => arg.startsWith('--username='))?.split('=')[1] || 'Anonymous';

        console.log(
            `Welcome to the File Manager, ${username}!\nType "help" to see example commands`
        );

        return username;
    }
}
export default session;
