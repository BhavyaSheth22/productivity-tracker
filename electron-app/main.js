const { app, BrowserWindow } = require('electron')
const {PythonShell} = require('python-shell');
var fs = require('fs');

var python;

function createWindow () {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./pages/login.html');

//   python = require('child_process').spawn('python', ['./tracker_script/autotimer.py']);
//   python.stdout.on('data',function(data){
//     console.log("data: ",data.toString('utf8'));
//   });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
//   python.kill('SIGINT');
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

