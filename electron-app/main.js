const { app, BrowserWindow } = require('electron')
// const {PythonShell} = require('python-shell');

// let pyshell;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html');
//   pyshell = new PythonShell('./tracker_script/autotimer.py');

//   pyshell.on('message', function(message) {
//     console.log(message);
//   })
  

  var python = require('child_process').spawn('python', ['./tracker_script/autotimer.py']);
  python.stdout.on('data',function(data){
    console.log("data: ",data.toString('utf8'));
  });
//   pyshell.run('./tracker_script/hello.py',  function  (err, results)  {
//     if  (err)  throw err;
//     console.log('hello.py finished.');
//     console.log('results', results);
//    });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})