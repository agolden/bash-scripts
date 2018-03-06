```
sudo apt-get update && \
  apt-get install -yq wget \
    syslinux \
    mtools

git clone https://github.com/agolden/bash-scripts.git
cd bash-scripts/create-esxi-installer
sudo ./create-esxi-installer
```

When prompted, enter the path to the USB disk (e.g., /dev/sdb).  Please note that **ALL** data on that disk will be destroyed, so enter carefully!
