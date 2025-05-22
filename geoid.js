fetch('geoid.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(results => {
        alert("TODO: Implement the calling interface to WASM module");
    });
