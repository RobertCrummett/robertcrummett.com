# Robert Nate Crummett's website

This is my very own website!

# Building the figures

Notice the toolchain **must** be defined (-D...) at the time the build
directory is created! Otherwise this will not work on MacOS.

```console
cmake -B build -DCMAKE_TOOLCHAIN_FILE=wasm32-toolchain.cmake
cmake --build build
```

# Links

[The Website (1/2)](https://robertcrummett.com)
[The Website (2/2)](https://natecrummett.com)
