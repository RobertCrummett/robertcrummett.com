fetch('geoid.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(results => {
        const sphharm = results.instance.exports.sphharm
        const free_all = results.instance.exports.free_all
        const free = results.instance.exports.free
        const memory = results.instance.exports.memory

        let n = 11
        let m = 0
        let x = 60.0

        let cp = Math.cos((90 - x) * Math.PI / 180)
        let sp = Math.sin((90 - x) * Math.PI / 180)

        const ptr = sphharm(n, m, cp, sp)
        const array = new Float64Array(memory.buffer, ptr, n)

        console.log(`phi(deg) = ${x}`)
        console.log("       n        m                 p_nm")
        for (let i = n - 9; i <= n; i++) {
            console.log(`  ${i}   ${m}   ${array[i-1]}`)
        }

        free_all()
    });
