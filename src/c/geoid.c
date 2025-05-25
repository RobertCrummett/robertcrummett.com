#include "trig.h"
#include "xalf.h"
#include "walloc.h"
#include "egm84.h"

#define WASM_EXPORT(A) __attribute__((export_name(A)))
#define NULL ((void *)0)
#define PI 3.1415926535897932384626433832795028841971693993751058209749445923078164062

#ifndef NDEBUG
#define ASSERT(x) do { if (!(x)) __builtin_trap(); } while (0)
#else // NDEBUG defined
#define ASSERT(x) do {} while (0)
#endif // NDEBUG defined?

#define NMAX 180 // Works for EGM84 - can go up to ~21,000 numerically, and system memory limited practically
#define NMAX23 (2*NMAX+3)

struct State {
	double *root;
	double *rooti;
	double *pn;
	double w;
	int n;
	int iw;
} state;

struct Positions {
	double *colatitude;
	double *longitude;
	int n;
} positions;

WASM_EXPORT("init_geoid") void init_geoid(float *colatitude, float *longitude, int npos)
{
	// Basically just allocates all of the state & positions arrays

	// Allocate space for scaling factor components
	state.root = malloc(NMAX23 * sizeof *state.root);
	ASSERT(state.root != NULL);
	state.rooti = malloc(NMAX23 * sizeof *state.rooti);
	ASSERT(state.rooti != NULL);

	// Preallocate all of the roots
	state.n = 0;
	state.nx = NMAX;
	prepr(&state.nx, state.root, state.rooti);

	// Allocate the associated legendre function values
	state.pn = malloc((NMAX+1) * sizeof *state.pn);
	ASSERT(state.pn != NULL);

	// Allocate the position data
	positions.n = npos;
	positions.colatitude = malloc(npos * sizeof *positions.colatitude);
	ASSERT(positions.colatitude != NULL);
	positions.longitude = malloc(npos * sizeof *positions.longitude);
	ASSERT(positions.longitude != NULL);
}

WASM_EXPORT("cleanup_geoid") void cleanup_geoid(void)
{
	// Just free all of the state & position arrays
	free(state.root);
	free(state.rooti);
	free(state.pn);
	free(positions.colatitude);
	free(positions.longitude);
}

WASM_EXPORT("update_geoid") double *update_geoid(void)
{
					
}
