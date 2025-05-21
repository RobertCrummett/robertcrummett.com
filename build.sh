#!/bin/sh
set -x

# Compile the Fortran
flang --target=i386-unknown-linux -O3 -emit-llvm -S xalf.f90 -o xalf.ll
llc --march=wasm32 -O3 -filetype=obj xalf.ll -o xalf.o

# Compile the C
clang --target=wasm32 -O3 -c geoid-figure.c
clang --target=wasm32 -O3 -c walloc.c

# Link everything together!
clang --target=wasm32 -nostdlib -Wl,--export-all -Wl,--no-entry -o geoid-figure.wasm geoid-figure.o walloc.o xalf.o
