CC=clang
FC=flang

CCFLAGS=--target=wasm32 -O3
FCFLAGS=--target=i386-unknown-linux -emit-llvm 

LLD=llc
CLDFLAGS=--target=wasm32 -O3 -nostdlib -Wl,--no-entry -Wl,--export-all
LLDFLAGS=--march=wasm32 -filetype=obj

geoid.wasm: geoid.o walloc.o xalf.o
	$(CC) $(CLDFLAGS) -o $@ $^

geoid.o: geoid.c trig.h xalf.h walloc.h egm84.h
	$(CC) $(CCFLAGS) -c $< -o $@

walloc.o: walloc.c
	$(CC) $(CCFLAGS) -c $< -o $@

xalf.ll: xalf.f90
	$(FC) $(FCFLAGS) -S $< -o $@

xalf.o: xalf.ll
	$(LLD) $(LLDFLAGS) $< -o $@

