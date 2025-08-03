const consoleLog = console.log;

console.log = (...args) => {
  if (args[0]) {
    
  }

  let logString = `%c${args[1]}`;
  let styledArgs = ['font-size: 30px; font-weight: bold;'];

  for (let i = 2; i < args.length; i++) {
    logString += `\n%c${args[i]}`;
    styledArgs.push('font-size: 15px; font-weight: normal;');
  }

  consoleLog(logString, ...styledArgs, ...args.slice(2));
};
