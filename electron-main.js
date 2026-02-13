
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 700,
    title: 'PharmaSmart Pro - Pharmacy OS',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#f8fafc',
    show: false,
    frame: true, // Set to false if you want a custom frameless UI
    webPreferences: {
      nodeIntegration: false, // Security best practice
      contextIsolation: true, 
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true
    }
  });

  // Load the local index.html
  mainWindow.loadFile('index.html');

  // Remove menu bar for a clean "App" feel
  mainWindow.setMenuBarVisibility(false);

  // Performance: Show window only when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Handle external links (e.g., medical documentation)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Ensure only one instance is running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);
}

// IPC Handlers for native functionality
ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.on('print-to-pdf', (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.print({ silent: true, printBackground: true });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
