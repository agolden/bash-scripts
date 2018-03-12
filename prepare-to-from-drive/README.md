To prepare a folder for drive upload:

```
zip -0 -r file.zip /path/to/files/foo
lbzip2 file.zip
zip -0 --encrypt file.zip file.zip.bz2
```

To prepare a folder from drive:

```
unzip file.zip
mv file.zip file.zip.old
lbunzip2 file.zip.bz2
unzip file.zip
```
