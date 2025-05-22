from math import cos, pi

def main(f, PRECISION, NAME):
    f.write("static double %s[] = {\n" % NAME)
    j = 0
    p = 0.0
    c = 0
    while True:

        if c == 0:
            f.write("    ");

        f.write("{:.20f},".format(cos(p)))
        j += 1
        c += 1
        p += PRECISION

        if p > 2*pi:
            break

        if c == 19:
            c = 0
            f.write("\n")
        else:
            f.write(" ")
    f.write(" 1.0};\n\n")
    f.write("const int %s_size = %d;\n" % (NAME, j+1))


if __name__ == '__main__':
    main(open("costable_1.h", "w"), 1.0, "costable_1")
    main(open("costable_0_1.h", "w"), 0.1, "costable_0_1")
    main(open("costable_0_01.h", "w"), 0.01, "costable_0_01")
    main(open("costable_0_001.h", "w"), 0.001, "costable_0_001")
    main(open("costable_0_0001.h", "w"), 0.0001, "costable_0_0001")
