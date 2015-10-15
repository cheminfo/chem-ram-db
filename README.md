# chem-ram-db

## CRD format, version 1

### Header

* Uint16: version of the format
* Uint32: number of entries

### Entry

* Uint32: molecule ID in the database
* Uint16: length of oclID (n)
* Uint8[n]: oclID
* Uint32[16]: index
* Float32: absolute weight
* Float32: relative weight
* Float32: logP
* Float32: logS
* Float32: PSA
* Uint32: acceptor count
* Uint32: donor count
* Uint32: rotatable bond count
* Uint32: stereo center count
