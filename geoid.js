fetch('geoid.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(results => {
        const init_geoid = results.instance.exports.init_geoid
        const update_geoid = results.instance.exports.update_geoid
        const free_geoid = results.instance.exports.free_geoid

        init_geoid(180)

        var order = 1
        var ptr = update_geoid(order)
        
        free_geoid()
    });
