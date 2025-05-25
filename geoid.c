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

static struct State {
    double *r;
    double *ri;
    double *d;
    double *ps;
    double *am;
    double *bm;
    double *pm;
    float *geoid;
    int *ips;
    int n;
} state;

static struct Grid {
    double p_start;
    double t_start;
    int p_count;
    int t_count;
    double p_cellsize;
    double t_cellsize;
} grid;

#define GRID_P_START 1.0
#define GRID_T_START -180.0
#define GRID_P_END 179.0
#define GRID_T_END 178.0
#define GRID_NP 90
#define GRID_NT 180

static void init_grid(void) {
    grid.p_start = GRID_P_START;
    grid.t_start = GRID_T_START;

    grid.p_count = GRID_NP;
    grid.t_count = GRID_NT;

    grid.p_cellsize = (GRID_P_END - GRID_P_START) / (GRID_NP - 1.0);
    grid.t_cellsize = (GRID_T_END - GRID_T_START) / (GRID_NT - 1.0);
}

static double deg2rad(double deg) {
    return deg * PI / 180.0;
}

static double get_phi(int index) {
    return deg2rad(grid.p_start + grid.p_cellsize * index);
}

static double get_theta(int index) {
    return deg2rad(grid.t_start + grid.t_cellsize * index);
}

static int offset(int n) {
    return CHUNK * ((n * (n + 1)) / 2 - 3);
}

WASM_EXPORT("init_geoid") void init_geoid(int nmax) {
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
    state.pm = (double *)malloc(nmax * sizeof(double));
    ASSERT(state.pm != NULL);

    int grid_size = grid.p_count * grid.t_count;
    state.geoid = (float *)malloc(grid_size * sizeof(float));
    ASSERT(state.geoid != NULL);

    // WARNING!!!
    // Removing the `volatile` on -O3 allows the compiler to
    // optimize the statement into a `calloc` call. This is
    // expected, but not desirable behavior, because calloc is
    // not implemented in `walloc.c`. For now, the volatile
    // prevents this.
    for (volatile int i = 0; i < grid_size; i++) {
        state.geoid[i] = 0.0;
    }

    state.n = nmax;
}

WASM_EXPORT("update_geoid") float *update_geoid(int m) {
    unsigned char *ptr = (unsigned char *)egm84;

    prepr_(&state.n, state.r, state.ri, state.d); // FUKUSHIMA Precompute multiplication factors

    for (int jp = 0; jp < grid.p_count; jp++) {
        double phi = get_phi(jp);
        double cphi = cos(phi);
        double sphi = sin(phi);

        alfsx_(&cphi, &state.n, state.d, state.ps, state.ips); // FUKUSHIMA Precompute sectorial ALF's
        prepab_(&m, &state.n, state.r, state.ri, state.am, state.bm); // FUKUSHIMA
        alfmx_(&sphi, &m, &state.n, state.am, state.bm, state.ps, state.ips, state.pm); // FUKUSHIMA

        for (int jt = 0; jt < grid.t_count; jt++) {
            double theta = get_theta(jt);
            double ctheta = cos(m * theta);
            double stheta = sin(m * theta);

            for (int n = (m > 2 ? m : 2); n <= state.n; n++) {
                int shift = offset(n) + CHUNK * m;
                float C = *(float *)(ptr + shift);
                float S = *(float *)(ptr + shift + 4);

                state.geoid[jp * grid.t_count + jt] += 
                    (float)((ctheta*C + stheta*S) * state.pm[n]);
            }
        }
    }
    return state.geoid;
}

WASM_EXPORT("free_geoid") void free_geoid(void) {
    free(state.r);
    free(state.ri);
    free(state.d);

    free(state.ps);
    free(state.ips);

    free(state.am);
    free(state.bm);
    free(state.pm);

    free(state.geoid);
}
