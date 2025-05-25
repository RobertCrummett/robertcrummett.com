SUBROUTINE prepr(nx, root, rooti) BIND(C, name="prepr")
	USE ISO_FORTRAN_ENV, ONLY: f64 => REAL64
	IMPLICIT REAL(f64) (a - h, o - z)
	IMPLICIT INTEGER(i - n)
	! Inputs and outputs
	INTEGER, INTENT(IN) :: nx
	REAL(f64), INTENT(OUT) :: root(*), rooti(*)

	root(1) = 1.d0
	rooti(1) = 1.d0
	DO n = 2, 2*nx + 3
	w = SQRT(DBLE(n))
	root(n) = w
	rooti(n) = 1.d0/w
	END DO
END SUBROUTINE prepr

SUBROUTINE xmalf(n, theta, pn, root, rooti, w, iw) BIND(C, name="xmalf")
	USE ISO_FORTRAN_ENV, ONLY: f64 => REAL64
	IMPLICIT REAL(f64) (a - h, o - z)
	IMPLICIT INTEGER(i - n)
	! Constants
	INTEGER, PARAMETER :: IND = 960
	REAL(f64), PARAMETER :: BIG = 2.d0**IND, BIGI = 2.d0**(-IND)
	REAL(f64), PARAMETER :: BIGS = 2.d0**(IND/2), BIGSI = 2.d0**(-IND/2)
	! The fixed degree
	INTEGER, INTENT(IN) :: n
	! Precomputed roots
	REAL(f64), INTENT(IN) :: root(*), rooti(*)
	! The legendre functions of degree n
	! Output will have m+1 orders, starting at index 0
	REAL(f64), INTENT(OUT) :: pn(0:)
	! State variables
	INTEGER, INTENT(INOUT) :: iw
	REAL(f64), INTENT(INOUT) :: w

	! Begin logic
	IF (n .EQ. 0) THEN
		pn(0) = 1.d0
		RETURN
	ELSEIF (n .EQ. 1) THEN
		cost = COS(theta)
		sint = SIN(theta)
		pn(0) = root(3)*cost
		w = root(3)*sint
		iw = 0
		pn(1) = w
		RETURN
	ELSEIF (n .GE. 2) THEN
		cost = COS(theta)
		sint = SIN(theta)
		IF (sint.EQ.0) THEN
			! The associated Legendre functions are not defined at the poles
			PRINT *, "ERROR theta", theta, "is too close to one of the poles"
			ERROR STOP
		ENDIF
		cott = cost/sint
		np2 = n + 2
		np1 = n + 1
		nm1 = n - 1
		nm2 = n - 2
		n2 = 2*n
		y = w
		iy = iw
		dn = root(n2 + 1)*rooti(n2)
		w = (dn*sint)*y
		iw = iy
		u = ABS(w)
		IF (u .LT. BIGSI) THEN
			w = w*BIG
			iw = iw - 1
		ELSEIF (u .GE. BIGS) THEN
			w = w*BIGI
			iw = iw + 1
		END IF
		IF (iw .EQ. 0) THEN
			pn(n) = w
		ELSEIF (iw .EQ. -1) THEN
			pn(n) = w*BIGI
		ELSEIF (iw .LT. 0) THEN
			pn(n) = 0.d0
		ELSEIF (iw .EQ. 1) THEN
			pn(n) = w*BIG
		ELSE
			pn(n) = 0.d0
		END IF
		y = w
		iy = iw
		ennm1 = root(n2)
		x = (ennm1*cott)*y
		ix = iy
		u = ABS(x)
		IF (u .LT. BIGSI) THEN
			x = x*BIG
			ix = ix - 1
		ELSEIF (u .GE. BIGS) THEN
			x = x*BIGI
			ix = ix + 1
		END IF
		IF (ix .EQ. 0) THEN
			pn(nm1) = x
		ELSEIF (ix .EQ. -1) THEN
			pn(nm1) = x*BIGI
		ELSEIF (ix .LT. 0) THEN
			pn(nm1) = 0.d0
		ELSEIF (ix .EQ. 1) THEN
			pn(nm1) = x*BIG
		ELSE
			pn(nm1) = 0.d0
		END IF
		DO m = nm2, 1, -1
		wnm = rooti(n - m)*rooti(np1 + m)
		enm = DBLE(2*m + 2)*wnm
		fnm = root(np2 + m)*root(nm1 - m)*wnm
		a = enm*cott
		b = -fnm
		id = ix - iy
		IF (id .EQ. 0) THEN
			z = a*x + b*y
			iz = ix
		ELSEIF (id .EQ. 1) THEN
			z = a*x + b*(y*BIGI)
			iz = ix
		ELSEIF (id .EQ. -1) THEN
			z = a*y + b*(x*BIGI)
			iz = iy
		ELSEIF (id .GT. 1) THEN
			z = a*x
			iz = ix
		ELSE
			z = b*y
			iz = iy
		END IF
		u = ABS(z)
		IF (u .LT. BIGSI) THEN
			z = z*BIG
			iz = iz - 1
		ELSEIF (u .GE. BIGS) THEN
			z = z*BIGI
			iz = iz + 1
		END IF
		IF (iz .EQ. 0) THEN
			pn(m) = z
		ELSEIF (iz .EQ. -1) THEN
			pn(m) = z*BIGI
		ELSEIF (iz .LT. 0) THEN
			pn(m) = 0.d0
		ELSEIF (iz .EQ. 1) THEN
			pn(m) = z*BIG
		ELSE
			pn(m) = 0.d0
		END IF
		y = x
		iy = ix
		x = z
		ix = iz
		END DO
		wnm = rooti(n)*rooti(np1)
		enm = root(2)*wnm
		fnm = root(np2)*root(nm1)*rooti(2)*wnm
		a = enm*cott
		b = -fnm
		id = ix - iy
		IF (id .EQ. 0) THEN
			z = a*x + b*y
			iz = ix
		ELSEIF (id .EQ. 1) THEN
			z = a*x + b*(y*BIGI)
			iz = ix
		ELSEIF (id .EQ. -1) THEN
			z = a*y + b*(x*BIGI)
			iz = iy
		ELSEIF (id .GT. 1) THEN
			z = a*x
			iz = ix
		ELSE
			z = b*y
			iz = iy
		END IF
		u = ABS(z)
		IF (u .LT. BIGSI) THEN
			z = z*BIG
			iz = iz - 1
		ELSEIF (u .GE. BIGS) THEN
			z = z*BIGI
			iz = iz + 1
		END IF
		IF (iz .EQ. 0) THEN
			pn(0) = z
		ELSEIF (iz .EQ. -1) THEN
			pn(0) = z*BIGI
		ELSEIF (iz .LT. 0) THEN
			pn(0) = 0.d0
		ELSEIF (iz .EQ. 1) THEN
			pn(0) = z*BIG
		ELSE
			pn(0) = 0.d0
		END IF
		RETURN
	ELSE
		PRINT *, "The degree should be a non-negative integer"
		ERROR STOP
	END IF
END SUBROUTINE xmalf
