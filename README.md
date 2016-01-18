# chem-ram-db

## Allowed types

`uint8`, `uint16`, `uint32`, `int8`, `int16`, `int32`, `float32`, `float64`, `ascii`

## CRD format, version 2

### Structure

* Uint16: version of the format (2)
* Uint16: number of custom fields
* Field definitions
* Uint32: number of records
* Records

## Field definition

* Uint8: data type
* Uint8: length in record (0 = variable length, 1 = single value, n>1 = array of n values)
* Uint8: label length
* ASCII: label

## Record

* Uint16: length of oclID (n)
* Uint8[n]: oclID
* Uint32[16]: index
* Float32: relative weight
* Custom fields
