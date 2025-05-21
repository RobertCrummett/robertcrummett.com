#ifndef WALLOC_H
#define WALLOC_H

typedef __SIZE_TYPE__ size_t;

extern void *malloc(size_t size);
extern void free(void *ptr);

#endif // WALLOC_H
