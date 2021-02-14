const electron = require('electron');
const {PythonShell} = require('python-shell');
var fs = require('fs');
const axios = require('axios');

const {app, BrowserWindow, Menu, ipcMain} = electron;


var python, location;

// function createWindow () {
//   const win = new BrowserWindow({
//     width: 1500,
//     height: 900,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })

//   win.loadFile('./pages/login.html');

  

  // python = require('child_process').spawn('python', ['./tracker_script/autotimer.py']);
  // python.stdout.on('data',function(data){
  //   console.log("data: ",data.toString('utf8'));
  // });

  // location = require('child_process').spawn('python', ['./tracker_script/geolocation.py']);
  // location.stdout.on('data',function(data){
  //   console.log("data: ",data.toString('utf8'));
  // });
// }

// app.whenReady().then(createWindow)

let win;

app.on('ready', function () {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.webContents.openDevTools()
  //win.loadFile('./pages/login.html');
  win.loadFile('./pages/admin/user_report.html');

  // python = require('child_process').spawn('python', ['./tracker_script/autotimer.py']);
  // python.stdout.on('data',function(data){
  //   console.log("data: ",data.toString('utf8'));
  // });
});


ipcMain.on('submitForm', (event, data) => {
  console.log(data);
  // event.sender.send('formSubmissionResults', data);
  win.webContents.send('formSubmissionResults', data);
  // axios.post('http://127.0.0.1:8080/login', data, {
  //       headers: {
  //           'Content-Type': 'application/json'
  //       }
  //   }).then((response) => {
  //       console.log(response.data);
  //       event.sender.send('formSubmissionResults', response.data);
  //       console.log('sent data');
  //   });
})

app.on('window-all-closed', () => {
  // python.kill('SIGINT');
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

