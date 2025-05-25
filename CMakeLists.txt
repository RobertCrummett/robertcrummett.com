cmake_minimum_required(VERSION 4.0)
project(robertcrummett LANGUAGES C Fortran)

# ==================== Build Configuration ====================

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src/headers)

# Regular C sources
add_library(walloc STATIC src/c/walloc.c)
target_include_directories(walloc PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/headers)
target_compile_options(walloc PRIVATE --target=wasm32 -O3)

add_library(geoid OBJECT src/c/geoid.c)
target_include_directories(geoid PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/headers)
target_compile_options(geoid PRIVATE --target=wasm32 -O3)

# Fortran->LLVM->WASM pipeline
add_custom_command(
	OUTPUT xalf.ll
	COMMAND ${CMAKE_Fortran_COMPILER} --target=i386-unknown-linux -emit-llvm -S 
	${CMAKE_CURRENT_SOURCE_DIR}/src/fortran/xalf.f90 -o xalf.ll
	DEPENDS src/fortran/xalf.f90
	WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
	COMMENT "Generating LLVM IR from Fortran"
)
add_custom_command(
	OUTPUT xalf.o
	COMMAND llc --march=wasm32 -filetype=obj xalf.ll -o xalf.o
	DEPENDS xalf.ll
	WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
	COMMENT "Compiling LLVM IR to WASM object"
)

# Final WASM linking
add_custom_command(
	OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm
	COMMAND ${CMAKE_C_COMPILER} --target=wasm32 -O3 -nostdlib -Wl,--no-entry
	$<TARGET_OBJECTS:geoid>
	$<TARGET_FILE:walloc>
	xalf.o
	-o ${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm
	DEPENDS geoid walloc xalf.o
	WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
	COMMENT "Linking WebAssembly module"
)

add_custom_target(build_wasm ALL DEPENDS ${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm)

# Installation
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm
	DESTINATION assets/wasm
	COMPONENT runtime)

add_custom_command(TARGET build_wasm POST_BUILD
	COMMAND ${CMAKE_COMMAND} -E copy
	${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm
	${CMAKE_CURRENT_SOURCE_DIR}/assets/wasm/geoid.wasm
	COMMENT "Copying WASM file to assets directory"
)

enable_testing()
add_test(NAME wasm_file_check
	COMMAND ${CMAKE_COMMAND} -E check_exists ${CMAKE_CURRENT_BINARY_DIR}/geoid.wasm)
