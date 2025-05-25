set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR wasm32)

# Use Clang/Flang for compilation
set(CMAKE_C_COMPILER clang)
set(CMAKE_C_COMPILER_TARGET wasm32)
set(CMAKE_Fortran_COMPILER flang)
set(CMAKE_Fortran_COMPILER_TARGET i386-unknown-linux)  # For LLVM IR generation

# Disable platform-specific flags
set(CMAKE_OSX_ARCHITECTURES "")
set(CMAKE_C_OSX_COMPATIBILITY_VERSION_FLAG "")
set(CMAKE_C_OSX_CURRENT_VERSION_FLAG "")

# Don't try to run test compilations
set(CMAKE_CROSSCOMPILING TRUE)
set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)
