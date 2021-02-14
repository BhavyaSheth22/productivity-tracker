// const settings = require('electron-settings');
// const axios = require('axios');
let ipcRenderer = require('electron').ipcRenderer;
// ipcRenderer.send('submitForm', formData);

const responseParagraph = document.getElementById('test2')

function getFormAData(e) {
    e.preventDefault();
    var username = document.getElementById('usernameA').value;
    var password = document.getElementById('passwordA').value;

    var formData = {
        "username": username,
        "password": password
    }

    // console.log(username, password);
    ipcRenderer.send('submitForm', formData);

    ipcRenderer.on('formSubmissionResults', function (event, args) {
        responseParagraph.innerHTML = args['message'];
        console.log(args);
    });

    // axios.post('http://127.0.0.1:8080/login', {
    //     "username": username,
    //     "password": password
    // }, {
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then((response) => {
    //     settings.set('response_code', response.status_code);
    // });

    // console.log(username, password);
    // var code = await settings.get('reponse_code');
    // console.log(code);
};

