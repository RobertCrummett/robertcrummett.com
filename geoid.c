#include "xalf.h"
#include "walloc.h"
#include "egm84.h"

#define NULL ((void *)0)
#define WASM_EXPORT __attribute__((used))
#define TRIGTERMS 7
#define PI 3.141592653589793

double *r = NULL;
double *ri = NULL;
double *d = NULL;
double *ps = NULL;
int *ips = NULL;
double *am = NULL;
double *bm = NULL;
double *pm = NULL;

float *ctheta = NULL;
float *stheta = NULL;
float *cphi = NULL;
float *sphi = NULL;

void prepare_coefficients(int n) {
    int n23 = n * 2 + 3;
    r  = (double *)malloc(n23 * sizeof *r);
    ri = (double *)malloc(n23 * sizeof *ri);
    d  = (double *)malloc(n * sizeof *d);

    prepr_(&n, r, ri, d);
}

void prepare_sectorial(int n, double cp) {
    if (!d) return;

    ps  = (double *)malloc(n * sizeof *ps);
    ips = (int *)   malloc(n * sizeof *ips);

    alfsx_(&cp, &n, d, ps, ips);
}

void prepare_ab(int n, int m) {
    if (!r || !ri) return;

    am = (double *)malloc(n * sizeof *am);
    bm = (double *)malloc(n * sizeof *bm);

    prepab_(&m, &n, r, ri, am, bm);
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

WASM_EXPORT prepare_grids(int ntheta, int nphi) {
    ctheta = (float *)malloc(ntheta * sizeof *ctheta);
    stheta = (float *)malloc(ntheta * sizeof *stheta);
    cphi = (float *)malloc(nphi * sizeof *cphi);
    sphi = (float *)malloc(nphi * sizeof *sphi);

    float theta_min = 1.0;
    float theta_max = 179.0;

    for (int i = 0; i < ntheta; i++) {
        float t = theta_min + ((float)i) / ntheta * (theta_max - theta_min);
        ctheta[i] = cosine(t);
        stheta[i] = sine(t);
    }

    float phi_max = 360.0;
    float phi_min = 1.0;

    for (int i = 0; i < nphi; i++) {
        float t = phi_min + ((float)i) / nphi * (phi_max - phi_min);
        cphi[i] = cosine(t);
        sphi[i] = sine(t);
    }
}

WASM_EXPORT double* sphharm(int n, int m, double cp, double sp) {
    unsigned char *ptr = (unsigned char *)egm84;

    prepare_coefficients(n);
    prepare_sectorial(n, cp);
    prepare_ab(n, m);

    return legendre(n, m, sp);
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

    if (ctheta) free(ctheta);
    if (stheta) free(stheta);
    if (cphi) free(cphi);
    if (sphi) free(sphi);

    r = NULL;
    ri = NULL;
    d = NULL;
    ps = NULL;
    ips = NULL;
    am = NULL;
    bm = NULL;
    pm = NULL;

    ctheta = NULL;
    stheta = NULL;
    cphi = NULL;
    sphi = NULL;
}
