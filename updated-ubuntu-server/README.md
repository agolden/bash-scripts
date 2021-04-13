You **MUST** create the following secret files prior to the running of this script:
* */etc/agolden/GMAIL_SMTP_USER*: The Gmail email address (e.g., XXXXX@agolden.com)
* */etc/agolden/GMAIL_SMTP_PASS*: The associated password for that account

```
sudo apt-get update && \
  apt-get install -yq wget \
    unattended-upgrades \
    sendmail \
    mailutils \
    sendmail-bin \
    ssh \
    wget \
    git

git config --global user.email "felix@agolden.com"
git config --global user.name "Alexander Golden"

git clone https://github.com/agolden/bash-scripts.git
cd bash-scripts/updated-ubuntu-server
sudo ./updated-ubuntu-server
```

**NOTE**: To skip configuration of a local smtp server, use the -m option
