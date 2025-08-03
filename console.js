const consoleLog = console.log;

console.log = (...args) => {
  if (args[0]) {
    return;
  }

  let logString = '';
  let styles = [];

  for (let i = 1; i < args.length; i++) {
    if (i === 1) {
      logString += `%c${args[i]}`;
      styles.push('font-size: 30px; font-weight: bold;');
    } else {
      logString += `\n%c${args[i]}`;
      styles.push('font-size: 15px; font-weight: normal;');
    }
  }

  consoleLog(logString, ...styles);
};
