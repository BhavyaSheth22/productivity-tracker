const electron = require('electron');
const {PythonShell} = require('python-shell');
var fs = require('fs');
const axios = require('axios');
const settings = require('electron-settings');
const { setegid } = require('process');

const {app, BrowserWindow, Menu, ipcMain} = electron;


var python, location;

let win;

app.on('ready', function () {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // win.webContents.openDevTools()
  //win.loadFile('./pages/login.html');
  win.loadFile('./pages/login.html');

  // python = require('child_process').spawn('python', ['./tracker_script/autotimer.py']);
  // python.stdout.on('data',function(data){
  //   console.log("data: ",data.toString('utf8'));
  // });
});


ipcMain.on('submitForm', (event, data) => {
  console.log(data);
  // event.sender.send('formSubmissionResults', data);
  // win.webContents.send('formSubmissionResults', data);
  axios.post('http://127.0.0.1:8080/login', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (response) => {
        console.log(response.data);
        event.sender.send('formSubmissionResults', response.data);
        console.log('sent data');
        await settings.set({'token': response.data.access_token});
        await settings.set({'user_id': response.data.id});
      
        (response.data.user_type == 1) ? win.loadFile('./pages/user_activity.html') : win.loadFile('./pages/admin/users.html'); 
    });
})

ipcMain.on('activitySubmission', async (event, data) => {
  console.log(data);
  // event.sender.send('formSubmissionResults', data);
  const id = await settings.get('user_id');
  axios.post(`http://127.0.0.1:8080/store_user_activity_data/${id}`,{
              'activities': data['activities'] 
            },{
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(response => {
          win.webContents.send('activityResponse', data);
      })
})

ipcMain.on('getAllUsers', async (event, data) => {
  console.log(data);
  axios.get('http://127.0.0.1:8080/get_all_users_data').then(response => {
          event.sender.send('userData', response.data);
          console.log(response);
      })
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

