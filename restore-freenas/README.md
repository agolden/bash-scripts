[Reassemble hardware](https://docs.google.com/document/d/1dRgmQQtJF9-gaV4NIBEkrGWj6AHI-QzBtIIydMYbPhM/edit?usp=sharing)

## Install FreeNAS

TODO: Create FreeNAS installation USB key

Configure root password: /etc/agolden/DEFAULT_INSECURE_PASSWORD

## Run network cables

![Backplane](images/ethernet_layout.png?raw=true)

igb0 = LAN1 --> Management network (.48/28)  
igb1 = LAN2 --> LAN network (.33/24)

## Restore configuration file

TODO: Create FreeNAS configuration backup  
TODO: Create FreeNAS configuration restore
