#include "xalf.h"
#include "walloc.h"

#define NULL ((void *)0)
#define WASM_EXPORT __attribute__((used))

static double *r = NULL;
static double *ri = NULL;
static double *d = NULL;
static double *ps = NULL;
static int *ips = NULL;
static double *am = NULL;
static double *bm = NULL;
static double *pm = NULL;

WASM_EXPORT void prepare_coefficients(int n) {
    int n23 = n * 2 + 3;
    r  = (double *)malloc(n23 * sizeof *r);
    ri = (double *)malloc(n23 * sizeof *ri);
    d  = (double *)malloc(n * sizeof *d);

    prepr_(&n, r, ri, d);
}

WASM_EXPORT void prepare_sectorial(int n, double cp) {
    if (!d) return;

    ps  = (double *)malloc(n * sizeof *ps);
    ips = (int *)   malloc(n * sizeof *ips);

    alfsx_(&cp, &n, d, ps, ips);
}

WASM_EXPORT void prepare_ab(int n, int m) {
    if (!r || !ri) return;

    am = (double *)malloc(n * sizeof *am);
    bm = (double *)malloc(n * sizeof *bm);

    prepab_(&m, &n, r, ri, am, bm);
}

WASM_EXPORT double* legendre(int n, int m, double sp) {
    pm = (double *)malloc(n * sizeof *pm);

    alfmx_(&sp, &m, &n, am, bm, &ps[m-1], &ips[m-1], pm); 

    return pm;
}

WASM_EXPORT void free_all(void) {
    if (r) free(r);
    if (ri) free(ri);
    if (d) free(d);
    if (ps) free(ps);
    if (ips) free(ips);
    if (am) free(am);
    if (bm) free(bm);
    if (pm) free(pm);
}
