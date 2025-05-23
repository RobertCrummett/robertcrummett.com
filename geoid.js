fetch('geoid.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(results => {
        const init_geoid = results.instance.exports.init_geoid
        const update_geoid = results.instance.exports.update_geoid
        const free_geoid = results.instance.exports.free_geoid

        const memory = results.instance.exports.memory

        const nmax = 180
        init_geoid(nmax)

        const array_size = 178 * 360
        for (let m = 0; m <= nmax; m++) {
            var ptr = update_geoid(m)

            const buffer = memory.buffer
            const geoid = new Float32Array(buffer, ptr, array_size)

            console.log(`m = ${m}     ${geoid[0]}`)
        }
        
        free_geoid()
    });
