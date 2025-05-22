#include "xalf.h"
#include "walloc.h"
#include "egm84.h"

#define NULL ((void *)0)
#define WASM_EXPORT __attribute__((used))
#define TRIGTERMS 7
#define PI 3.141592653589793

#ifndef NDEBUG
#define ASSERT(x) do { if (!(x)) __builtin_trap(); } while (0)
#else // NDEBUG defined
#define ASSERT(x) do {} while (0)
#endif // NDEBUG defined?

struct State {
    double *r;
    double *ri;
    double *d;
    double *ps;
    double *am;
    double *bm;
    double *pm;
    double *geoid;
    int *ips;
    int order; 
} state;

struct Grid {
    double p_start;
    double t_start;
    double p_count;
    double t_count;
    double p_cellsize;
    double t_cellsize;
} grid;

#define GRID_P_START 1.0
#define GRID_T_START -180.0
#define GRID_P_END 179.0
#define GRID_T_END 178.0
#define GRID_NP 90
#define GRID_NT 180

static inline float cosine(int deg) {
    deg %= 360; // make it less than 360
    float rad = deg * PI / 180;
    float cos = 0;

    int i;
    for(i = 0; i < TRIGTERMS; i++) { // That's also Taylor series!!
        cos += power(-1, i) * power(rad, 2 * i) / fact(2 * i);
    }
    return cos;
}

static void init_grid(void) {
    grid.p_start = GRID_P_START;
    grid.t_start = GRID_T_START;

    grid.p_count = GRID_NP;
    grid.t_count = GRID_NT;

    grid.p_cellsize = (GRID_P_END - GRID_P_START) / (GRID_NP - 1.0);
    grid.t_cellsize = (GRID_T_END - GRID_T_START) / (GRID_NT - 1.0);
}

static inline double get_phi(int index) {
    return grid.p_start + grid.p_cellsize * index
}

WASM_EXPORT void init_geoid(int nmax) {
    /* Initialize the grid */
    init_grid();

    int n23max = nmax * 2 + 3;

    state.r  = (double *)malloc(n23max * sizeof(double));
    ASSERT(state.r != NULL);
    state.ri = (double *)malloc(n23max * sizeof(double));
    ASSERT(state.ri != NULL);
    state.d  = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.d != NULL);

    state.ps  = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.ps != NULL);
    state.ips = (int *)malloc(nmax * sizeof(int));
    ASSERT(state.ips != NULL);

    state.am = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.am != NULL);
    state.bm = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.bm != NULL);

    state.am = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.am != NULL);
    state.bm = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.bm != NULL);
}

WASM_EXPORT double *make_geoid(int n /* degree */) {
    prepr_(&n, state.r, state.ri, state.d);              // FUKUSHIMA Precompute multiplication factors

    for (int jp = 0; jp < grid.p_count; jp++) {
        double phi = get_phi(jp);
        double cphi = cosine(phi);

        alfsx_(&cphi, &n, state.d, state.ps, state.ips); // FUKUSHIMA Precompute sectorial ALF's

        for (int m = 0; m <= n; m++)

    }

    /* order dependant terms */
    // for (int m = 0; m <= n; m++) {
    //     prepab_(&m, &n, r, ri, am, bm);
    // }

    return NULL;
}

/*
WASM_EXPORT void kill_geoid(void) {
    ASSERT(0 && "TODO: clean the state");
}

double* legendre(int n, int m, double sp) {
    pm = (double *)malloc(n * sizeof *pm);

    alfmx_(&sp, &m, &n, am, bm, &ps[m-1], &ips[m-1], pm); 

    if (m > 0) {
        for (int i = 0; i < m-1; i++)
            pm[i] = 0.0;
    }

    return pm;
}

static inline float power(float base, int exp) {
    if(exp < 0) {
        if(base == 0)
            return -0; // Error!!
        return 1 / (base * power(base, (-exp) - 1));
    }
    if(exp == 0)
        return 1;
    if(exp == 1)
        return base;
    return base * power(base, exp - 1);
}

static inline int fact(int n) {
    return n <= 0 ? 1 : n * fact(n-1);
}

static inline float sine(int deg) {
    deg %= 360;
    float rad = deg * PI / 180;
    float sin = 0;

    int i;
    for(i = 0; i < TRIGTERMS; i++) {
        sin += power(-1, i) * power(rad, 2 * i + 1) / fact(2 * i + 1);
    }
    return sin;
}

static inline float cosine(int deg) {
    deg %= 360; // make it less than 360
    float rad = deg * PI / 180;
    float cos = 0;

    int i;
    for(i = 0; i < TRIGTERMS; i++) { // That's also Taylor series!!
        cos += power(-1, i) * power(rad, 2 * i) / fact(2 * i);
    }
    return cos;
}
*/
