/* global require chrome window document setTimeout process */

import '../styles/styles.less';

const packageDetails = require('../../package.json');

let commandIndex = -1;

const commandLog = [];

const executeCurrentCommand = () => {
    executeCommand(document.querySelector('#input').value);
};

const executeCommand = command => {
    chrome.tabs.query(
        {
            active: true,
            lastFocusedWindow: true
        },
        tabs => {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: command
                },
                result => {
                    if (result && result[0]) {
                        appendResultToLog(result[0]);
                    } else {
                        appendResultToLog('null');
                    }

                    setTimeout(makeLogsScrollableMaybe);
                });
        });
};

const appendResultToLog = result => {
    document.querySelector('#log').innerHTML += `<div class="result">> ${result}</div>`;
    scrollLogToBottom();
};

const makeLogsScrollableMaybe = () => {
    const logContainer = document.querySelector('#console-log');

    logContainer.className = logContainer.scrollHeight > logContainer.offsetHeight
        ? 'scrollable'
        : '';
};

const scrollLogToBottom = () => {
    const logContainer = document.querySelector('#console-log');

    logContainer.scrollTop = logContainer.scrollHeight;
};

const appendCurrentCommandToLog = () => {
    const command = document.querySelector('#input').value;

    commandLog.push(command);
    commandIndex = -1;

    document.querySelector('#log').innerHTML += `<div class="command">${command}</div>`;
    document.querySelector('#input').value = '';
};

const clearLog = () => {
    document.querySelector('#log').innerHTML = '';
    setTimeout(makeLogsScrollableMaybe);
};

const loadPreviousCommand = function () {
    if (!commandIndex || commandIndex === -1) {
        commandIndex = commandLog.length - 1;
    } else {
        commandIndex -= 1;
    }

    loadCommandToInput(commandIndex);
};

const loadNextCommand = () => {
    if (commandIndex === commandLog.length - 1 || commandIndex === -1) {
        commandIndex = 0;
    } else {
        commandIndex += 1;
    }

    loadCommandToInput(commandIndex);
};

const loadCommandToInput = index => {
    const inputBox = document.querySelector('#input');

    if (commandIndex !== -1) {
        inputBox.value = commandLog[index];
        setTimeout(() => {
            inputBox.selectionStart = inputBox.value.length;
            inputBox.selectionEnd = inputBox.value.length;
        });
    }
};

const start = () => {
    document.querySelector('#title').innerText = `Chrome Quick Console ${packageDetails.version}${process.env.NODE_ENV === 'development' ? ' [DEBUG]' : ''}`;

    document.querySelector('#clear').onclick = clearLog;

    document.querySelector('#evaluate').onclick = function () {
        executeCurrentCommand();
        appendCurrentCommandToLog();
    };

    document.querySelector('#input').onkeydown = function (e) {
        if (e.keyCode === 13) {
            executeCurrentCommand();
            appendCurrentCommandToLog();
            return false;
        } else if (e.keyCode === 38) {
            loadPreviousCommand();
        } else if (e.keyCode === 40) {
            loadNextCommand();
        }

        return true;
    };
};

window.addEventListener('load', start);
