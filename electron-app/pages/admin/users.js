let ipcRenderer = require('electron').ipcRenderer; 
const $ = require('jquery');

ipcRenderer.send('getAllUsers', 'now');

ipcRenderer.on('userData', function(event, args) {
    var div = document.getElementById('deck');
    div.innerHTML = null;
    let html_str = ``;
    args.forEach(element => {
        if(element.type === 1) {
            html_str += `
            <div class="col-md-4">
            <div class="card-mess ml-1 mr-1">
                <div class="card-header">
                    <h4 style="text-align: center;" class="card-title">${element.username}</h4>
                </div>
                <div class="card-body" style="padding-top: 0px;">
        
                    <p style="text-align: right;"><small>Date: 14/02/2021</small></p>
                    <p style="color: black; text-align: center;">Job Description : Data Analyst</p>
                </div>
                <div style="margin: 0 auto;display:flex; justify-content: center;padding-bottom: 20px;" class="col-md-5"><img width=125px height=125px
                        src="../../assets/images/mark.jpg" alt="food"></div>
                <div style="margin: 0 auto;display:flex; justify-content: center;padding>a href="user_report.html">       
                <button type="submit" class="btn btn-primary" id="${element._id.$oid}" onclick="openUser(this.id)">View report</button>
                </a>
                </div>
            </div>
            </div>
            `
        }    
    });
    div.innerHTML = html_str;
});

function openUser(id) {
    ipcRenderer.send('getUserInfo', id);
}

{/* <div class="card-deck grid-mess ml-2 mr-2" style="padding: auto;"> */}
