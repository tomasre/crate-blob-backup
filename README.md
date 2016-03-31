# crate-blob-backup
node utility for backing up blobs to crate cluster

## Meta Table Layout   
filename    
path    
hash   

For example file path: examples/exampleData/d3/vid/blah.mp4    
filename: blah.mp4   
path: examples/exampleData/d3/vid/blah.mp4    
hash: [hash of file to get blob]   
size: [size of the file in bytes]   

path is the primary key and must be unique   
