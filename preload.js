
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  printReceipt: () => ipcRenderer.send('print-to-pdf'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  isDesktop: true
});
