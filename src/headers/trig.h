#ifndef TRIG_H_
#define TRIG_H_

#define CONST_PI 3.1415926535897932384626433832795028841971693993751058209749445923078164062
#define CONST_2PI (2*CONST_PI)
#define modd(x, y) ((x) - (int)((x) / (y)) * (y))

double cos(double x)
{
    x = modd(x, CONST_2PI);
    char sign = 1;
    if (x > CONST_PI)
    {
        x -= CONST_PI;
        sign = -1;
    }
    double xx = x * x;

    return sign * (1+xx*(-1.0/2+xx*(1.0/24+xx*(-1.0/720+xx*(1.0/40320+xx*(-1.0/3628800+xx*(1.0/479001600+xx*(-1.0/87178291200+xx*(1.0/20922789888000+xx*(-1.0/6402373705728000+xx/2432902008176640000))))))))));
}

double sin(double x) {
    return cos(CONST_PI/2-x);
}

#undef modd
#undef CONST_PI
#undef CONST_2PI

#endif // TRIG_H_
