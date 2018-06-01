/* global require chrome window document setTimeout */

import '../styles/styles.less';

const manifestDetails = require('../manifest.json');

let commandIndex = -1;

const commandLog = [];

const executeCurrentCommand = function () {
    executeCommand(document.querySelector('#input').value);
};

const executeCommand = function (command) {
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
                });
        });
};

const appendResultToLog = function (result) {
    document.querySelector('#log').innerHTML += `<div class="result">> ${result}</div>`;
    scrollLogToBottom();
};

const scrollLogToBottom = function () {
    const logContainer = document.querySelector('#console-log');

    logContainer.scrollTop = logContainer.scrollHeight;
};

const appendCurrentCommandToLog = function () {
    const command = document.querySelector('#input').value;

    commandLog.push(command);
    commandIndex = -1;

    document.querySelector('#log').innerHTML += `<div class="command">${command}</div>`;
    document.querySelector('#input').value = '';
};

const clearLog = function () {
    document.querySelector('#log').innerHTML = '';
};

const loadPreviousCommand = function () {
    if (!commandIndex || commandIndex === -1) {
        commandIndex = commandLog.length - 1;
    } else {
        commandIndex -= 1;
    }

    loadCommandToInput(commandIndex);
};

const loadNextCommand = function () {
    if (commandIndex === commandLog.length - 1 || commandIndex === -1) {
        commandIndex = 0;
    } else {
        commandIndex += 1;
    }

    loadCommandToInput(commandIndex);
};

const loadCommandToInput = function (index) {
    const inputBox = document.querySelector('#input');

    if (commandIndex !== -1) {
        inputBox.value = commandLog[index];
        setTimeout(() => {
            inputBox.selectionStart = inputBox.value.length;
            inputBox.selectionEnd = inputBox.value.length;
        });
    }
};

const load = function () {
    document.querySelector('#title').innerText = `${manifestDetails.name} ${manifestDetails.version}`;

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

window.addEventListener('load', load);

