#ifndef XALF_H
#define XALF_H

#ifdef __cplusplus
extern "C" {
#endif // __cpluslpus

void alfsx_(double *u, int *nx, double *d, double *ps, int *ips);
void alfmx_(double *t, int *m, int *nx, double *am, double *bm, 
            double *psm, int *ipsm, double *pm);
void prepab_(int *m, int *nx, double *r, double *ri, double *am, double *bm);
void prepr_(int *nx, double *r, double *ri, double *d);

#ifdef __cplusplus
}
#endif // __cplusplus

#endif // XALF_H
