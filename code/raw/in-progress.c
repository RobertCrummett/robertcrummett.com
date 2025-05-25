// in-progress.c
#ifndef NDEBUG
#define ASSERT(x) do { if (!(x)) __builtin_trap(); } while (0)
#else
#define ASSERT(x) do { } while (0)
#endif

int main(void) {
    ASSERT(0 && "TODO: Add my projects to this page.");
    return 0;
}
