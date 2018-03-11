If sdelete not on computer, download and install it using PowerShell:
```
Invoke-WebRequest https://s3.amazonaws.com/amg-server-content/SDelete.zip -OutFile SDelete.zip
Expand-Archive SDelete.zip -DestinationPath SDelete
```
TODO: copy SDelete to c:\Windows\System32

- Restart your PC. When you get to the sign-in screen, hold the Shift key down while you select Power Power icon > Restart.
- After your PC restarts to the Choose an option screen, select Troubleshoot > Advanced options > Startup Settings > Restart.
- After your PC restarts, you'll see a list of options. Select 4 or F4 to start your PC in Safe Mode.
- Run command line (cmd) as an administrator
```
sdelete -z c:
```

Shrink the disk from vmware shell:
vmkfstools --punchzero [DISKNAME].vmdk

