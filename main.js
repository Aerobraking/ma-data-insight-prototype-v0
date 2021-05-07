const { app, BrowserWindow, Menu } = require('electron')
const drivelist = require('drivelist');
const { ipcMain } = require('electron')

let driveListFinal=[];


async function listDrivesInit() {
    const drives = await drivelist.list();
 

    drives.forEach((drive) => {
        if (drive.mountpoints.length > 0) { 
            driveListFinal.push(drive.mountpoints[0].path);
        }
    });
 
}
listDrivesInit();


 function listDrives() {
    

    return driveListFinal;
}

exports.listDrives = listDrives;





const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

// (async () => {
//     for await (const f of getFiles('D:/Games/')) {
//       console.log(f);
//     }
//   })()
 



/**
 * Create drag event to desktop
 */
 ipcMain.handle('ondragstart', (event, filePath) => {
    console.log("BACKEND DESKTOP DRAG START");
    event.sender.startDrag({
      file: filePath,
      icon: 'D:/git projects/electron-app1/drag.jpg'
    })
  })


function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1800,
        height: 800,
        
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.setPosition(0,0,true);



    const fs = require('fs')

    const root = fs.readdirSync('/')

    // This will print all files at the root-level of the disk,
    // either '/' or 'C:\'.
    console.log(root)



    // and load the index.html of the app.
    win.loadFile('src/index.html')
    // Open the DevTools.
    win.webContents.openDevTools()

    var menu = Menu.buildFromTemplate([{
        label: 'Menu',
        submenu: [

            {
                label: 'Open Folders', click() {

                }
            },
            { label: 'Open Workspace' },
            { type: 'separator' },
            {
                label: 'Quit App', click() {
                    app.quit();
                }
            },
        ]
    },
    {
        label: 'About'
    }
    ]);

    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.