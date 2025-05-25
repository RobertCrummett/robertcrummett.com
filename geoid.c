#include "trig.h"
#include "xalf.h"
#include "walloc.h"
#include "egm84.h"

#define WASM_EXPORT(A) __attribute__((export_name(A)))

#define NULL ((void *)0)
#define PI 3.1415926535897932384626433832795028841971693993751058209749445923078164062
#define CHUNK 8

#ifndef NDEBUG
#define ASSERT(x) do { if (!(x)) __builtin_trap(); } while (0)
#else // NDEBUG defined
#define ASSERT(x) do {} while (0)
#endif // NDEBUG defined?

struct State {
	double *root;
	double *rooti;
	double *pn;
	double w;
	int n;
	int nx;
	int iw;
} state;

struct Positions {
	double *colat;
	double *lon;
} pos;

WASM_EXPORT("init_geoid") void init_geoid(int nx)
{
	state.root = malloc((2*nx+3) * sizeof *state.root);
	ASSERT(state.root != NULL);
	state.rooti = malloc((2*nx+3) * sizeof *state.rooti);
	ASSERT(state.rooti != NULL);

	// Preallocate all of the roots
	state.n = 0;
	state.nx = nx;
	prepr(&state.nx, state.root, state.rooti);

	state.pn = malloc((nx+1) * sizeof *state.pn);
	ASSERT(state.pn != NULL);
}

WASM_EXPORT("update_geoid") void update_geoid() {
	ASSERT(0 && "TODO");
}
