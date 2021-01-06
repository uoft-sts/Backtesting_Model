
Dropzone.options.dropper = {
    paramName: 'file',
    chunking: true,
    forceChunking: true,
    url: '/result',
    maxFilesize: 1025, // megabytes
    chunkSize: 1000000 // bytes
}
