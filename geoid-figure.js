fetch('geoid-figure.wasm').then(response =>
    response.arrayBuffer()
).then(bytes =>
        WebAssembly.instantiate(bytes)
    ).then(results => {
        const prepare_coefficients = results.instance.exports.prepare_coefficients
        const prepare_sectorial = results.instance.exports.prepare_sectorial
        const prepare_ab = results.instance.exports.prepare_ab
        const legendre = results.instance.exports.legendre
        const free_all = results.instance.exports.free_all
        const memory = results.instance.exports.memory

        let n = 648000
        let m = 324000
        let x = 30.0
        let cp = Math.cos(x * Math.PI / 180)
        let sp = Math.sin(x * Math.PI / 180)

        prepare_coefficients(n)
        prepare_sectorial(n, cp)
        prepare_ab(n, m)

        const ptr = legendre(n, m, sp)

        const array = new Float64Array(memory.buffer, ptr, n)

        console.log(`phi(deg) = ${x}`)
        console.log("       n        m                 p_nm")
        for (let i = n - 10; i <= n; i++) {
            console.log(`  ${i}   ${m}   ${array[i-1]}`)
        }

        free_all()
    });
