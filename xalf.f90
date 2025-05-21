!----------------------------------------------------
!(xalfmx.f90)
!----------------------------------------------------
! program xalfmx
! !
! !   Test Driver of "alfsx" and "alfmx"
! !
! !   Author: Toshio FUKUSHIMA <Toshio.Fukushima@nao.ac.jp>
! !
! !   Reference: Fukushima (2012), J. Geodesy, 86, 271-285
! !
! integer NMAX,NMAX23
! parameter (NMAX=648000,NMAX23=NMAX*2+3)
! real*8 r(NMAX23),ri(NMAX23),d(NMAX)
! real*8 PI,phi,sp,cp,am(NMAX),bm(NMAX),pm(NMAX),ps(NMAX)
! integer nx,ips(NMAX),m,n
! !
! nx=11
! call prepr(nx,r,ri,d)
! PI=4.d0*atan(1.d0)
! phi=30.d0
! write(*,"(a10,0pf10.5)") "phi(deg) =",phi
! phi=phi*PI/180.d0; sp=sin(phi); cp=cos(phi)
! call alfsx(cp,nx,d,ps,ips)
! m=nx/2
! call prepab(m,nx,r,ri,am,bm)
! call alfmx(sp,m,nx,am,bm,ps(m),ips(m),pm)
! write(*,"(2a10,a25)") "n","m","p_nm"
! do n=nx-10,nx
!     write(*,"(2i10,1pe25.15)") n,m,pm(n)
! enddo
! end program xalfmx
!----------------------------------------------------
!(alfmx.f90)
!--------------------------------------------------
subroutine alfmx(t,m,nx,am,bm,psm,ipsm,pm)
    !
    !   Compute fnALF by using X-numbers
    !
    !   Author: Toshio FUKUSHIMA <Toshio.Fukushima@nao.ac.jp>
    !
    !   Reference: Fukushima (2012), J. Geodesy, 86, 271-285
    !
    integer m,nx,ipsm,IND,ix,iy,n,id,iz
    parameter (IND=960)
    real*8 t,am(*),bm(*),psm,pm(*),BIG,BIGI,BIGS,BIGSI,x,y,w,z
    parameter (BIG=2.d0**IND,BIGI=2.d0**(-IND))
    parameter (BIGS=2.d0**(IND/2),BIGSI=2.d0**(-IND/2))
    x=psm; ix=ipsm
    if(ix.eq.0) then
        pm(m)=x
    elseif(ix.lt.-1) then   ! ADDED 2011/12/06
        pm(m)=0.d0          ! ADDED 2011/12/06
    elseif(ix.lt.0) then
        pm(m)=x*BIGI
    else
        pm(m)=x*BIG
    endif
    if(m.ge.nx) return
    y=x; iy=ix; x=(am(m+1)*t)*y; ix=iy; w=abs(x)
    if(w.ge.BIGS) then
        x=x*BIGI; ix=ix+1
    elseif(w.lt.BIGSI) then
        x=x*BIG; ix=ix-1
    endif
    if(ix.eq.0) then
        pm(m+1)=x
    elseif(ix.lt.-1) then   ! ADDED 2011/12/06
        pm(m+1)=0.d0        ! ADDED 2011/12/06
    elseif(ix.lt.0) then
        pm(m+1)=x*BIGI
    else
        pm(m+1)=x*BIG
    endif
    do n=m+2,nx
        id=ix-iy
        if(id.eq.0) then
            z=(am(n)*t)*x-bm(n)*y; iz=ix
        elseif(id.eq.1) then
            z=(am(n)*t)*x-bm(n)*(y*BIGI); iz=ix
        elseif(id.eq.-1) then
            z=(am(n)*t)*(x*BIGI)-bm(n)*y; iz=iy
        elseif(id.gt.1) then
            z=(am(n)*t)*x; iz=ix
        else
            z=-bm(n)*y; iz=iy
        endif
        w=abs(z)
        if(w.ge.BIGS) then
            z=z*BIGI; iz=iz+1
        elseif(w.lt.BIGSI) then
            z=z*BIG; iz=iz-1
        endif
        if(iz.eq.0) then
            pm(n)=z
        elseif(iz.lt.-1) then   ! ADDED 2011/12/06
            pm(n)=0.d0          ! ADDED 2011/12/06
        elseif(iz.lt.0) then
            pm(n)=z*BIGI
        else
            pm(n)=z*BIG
        endif
        y=x; iy=ix; x=z; ix=iz
    enddo
    return; end
!----------------------------------------------------
!(alfsx.f90)
!----------------------------------------------------
subroutine alfsx(u,nx,d,ps,ips)
    !
    !   Prepare the sectorial fnALF in X-numbers
    !
    !   Author: Toshio FUKUSHIMA <Toshio.Fukushima@nao.ac.jp>
    !
    !   Reference: Fukushima (2012), J. Geodesy, 86, 271-285
    !
    integer nx,ips(*),IND,ix,m
    real*8 u,d(*),ps(*),BIG,BIGI,BIGS,BIGSI,ROOT3,x,y
    parameter (IND=960,BIG=2.d0**IND,BIGI=2.d0**(-IND))
    parameter (BIGS=2.d0**(IND/2),BIGSI=2.d0**(-IND/2))
    parameter (ROOT3=1.732050807568877d0)
    x=ROOT3*u; ix=0; ps(1)=x; ips(1)=ix
    do m=2,nx
        x=(d(m-1)*u)*x; y=abs(x)
        if(y.ge.BIGS) then
            x=x*BIGI; ix=ix+1
        elseif(y.lt.BIGSI) then
            x=x*BIG; ix=ix-1
        endif
        ps(m)=x; ips(m)=ix
    enddo
    return; end
!----------------------------------------------------
!(prepab.f90)
!------------------------------------------------
subroutine prepab(m,nx,r,ri,am,bm)
    !
    !   Prepare coefficients a_nm and b_nm for order m
    !
    !   Author: Toshio FUKUSHIMA <Toshio.Fukushima@nao.ac.jp>
    !
    integer nx
    real*8 r(*),ri(*),am(*),bm(*)
    integer n,m,j
    real*8 w
    am(m+1)=r(2*m+3)
    do n=m+2,nx
        w=r(2*n+1)*ri(n-m)*ri(n+m)
        am(n)=r(2*n-1)*w
        bm(n)=r(n-m-1)*r(n+m-1)*ri(2*n-3)*w
    enddo
    return
end
!----------------------------------------------------
!(prepr.f90)
!---------------------------------------------------
subroutine prepr(nx,r,ri,d)
    !
    !   Prepare constants r(m)=sqrt(m) and ri(m)=1/sqrt(m)
    !
    !   Author: Toshio FUKUSHIMA <Toshio.Fukushima@nao.ac.jp>
    !
    integer nx,m
    real*8 r(*),ri(*),d(*),w
    do m=1,nx*2+3
        w=sqrt(dble(m))
        r(m)=w
        ri(m)=1.d0/w
    enddo
    do m=1,nx
        d(m)=r(2*m+3)*ri(2*m+2)
    enddo
    return
end
!----------------------------------------------------
!(a.out)
!----------------------------------------------------
!phi(deg) =  30.00000
!         n         m                     p_nm
!    647990    324000   -1.318644478579710E+00
!    647991    324000    3.529655395944455E-01
!    647992    324000    1.726214976113255E+00
!    647993    324000    1.640303181792076E+00
!    647994    324000    1.678507249790577E-01
!    647995    324000   -1.446484516979031E+00
!    647996    324000   -1.838110525930454E+00
!    647997    324000   -6.759867164464393E-01
!    647998    324000    1.057546551917008E+00
!    647999    324000    1.897136569738410E+00
!    648000    324000    1.133078610545075E+00
!------------------------------------------------------ 

