'use client';
import '@/components/header/app.header.scss';
// import { useRouter } from 'next/navigation';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import Tippy from '@tippyjs/react';

const Search = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginRight: theme.spacing(2),
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
   },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
         // width: '20ch',
         width: '400px',
      },
   },
}));

export default function AppHeader() {
   const { data: session } = useSession();
   const router = useRouter();
   const [isVisibleTippy, setIsVisibleTippy] = React.useState(false);
   const tooltipRef = React.useRef(null);
   const avatarRef = React.useRef(null);

   const handleRedirectHome = () => {
      router.push('/');
   };

   React.useEffect(() => {
      const handleClickOutside = (event: any) => {
         //@ts-ignore
         if (
            tooltipRef.current &&
            //@ts-ignore
            !tooltipRef.current.contains(event.target) &&
            //@ts-ignore
            !avatarRef.current.contains(event.target)
         ) {
            setIsVisibleTippy(false);
         }
      };
      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, []);
   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static" sx={{ backgroundColor: '#333', position: 'fixed', zIndex: 10 }}>
            <Container>
               <Toolbar
                  sx={{
                     ml: '-15px',
                     mr: '-15px',
                  }}
                  className="custom-height"
               >
                  <Typography
                     variant="h6"
                     noWrap
                     component="div"
                     sx={{
                        fontSize: '18px',
                        display: { xs: 'none', sm: 'block', cursor: 'pointer' },
                        '&: hover': {
                           opacity: '0.8',
                        },
                     }}
                     onClick={() => handleRedirectHome()}
                  >
                     DamonIT SC
                  </Typography>
                  <Search
                     className="app.header.search"
                     sx={{
                        height: '28px',
                        backgroundColor: '#fff',
                        '&: hover': {
                           backgroundColor: '#fff',
                        },
                     }}
                  >
                     <SearchIconWrapper
                        sx={{
                           height: '30px',
                           color: '#333',
                        }}
                     >
                        <SearchIcon />
                     </SearchIconWrapper>
                     <StyledInputBase
                        sx={{
                           fontSize: '14px',
                           height: '28px',
                           color: '#333',
                        }}
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                     />
                  </Search>
                  <Box sx={{ flexGrow: 1 }} />
                  {session ? (
                     <>
                        <Box
                           sx={{
                              display: { xs: 'none', md: 'flex' },
                              gap: '20px',
                              alignItems: 'center',
                              '> a': {
                                 cursor: 'pointer',
                                 color: 'unset',
                                 textDecoration: 'unset',
                                 fontSize: '14px',
                                 '&: hover': {
                                    opacity: '0.85',
                                 },
                              },
                           }}
                        >
                           <Link href={'/playlist'}>Playlist</Link>
                           <Link href={'/like'}>Likes</Link>
                           <Link href={'track'}>Upload</Link>
                           <Tippy
                              visible={isVisibleTippy}
                              interactive={true}
                              content={
                                 <div
                                    ref={tooltipRef}
                                    style={{
                                       marginRight: '50px',
                                       minWidth: '100px',
                                       paddingTop: '10px',
                                       paddingBottom: '10px',
                                       marginTop: '-2px',
                                       borderRadius: '5px',
                                       backgroundColor: 'white',
                                       boxShadow: '0px 2px 10px 1px rgba(0,0,0,0.1)',
                                    }}
                                 >
                                    <div
                                       style={{
                                          top: -18,
                                          left: 65,
                                          position: 'absolute',
                                          zIndex: 60,
                                          width: 0,
                                          height: 0,
                                          borderLeft: '10px solid transparent',
                                          borderRight: '10px solid transparent',
                                          borderBottom: '10px solid white',
                                          borderTop: '10px solid transparent',
                                       }}
                                    ></div>
                                    <Box
                                       sx={{
                                          paddingLeft: '25px',
                                          textAlign: 'left',
                                          '&: hover': {
                                             backgroundColor: '#eee',
                                          },
                                          '> a': {
                                             width: '100%',
                                             cursor: 'pointer',
                                             color: 'black',
                                             textDecoration: 'unset',
                                             fontSize: '14px',
                                          },
                                       }}
                                    >
                                       <Link
                                          href="/profile"
                                          onClick={() => {
                                             setIsVisibleTippy(false);
                                          }}
                                       >
                                          Profile
                                       </Link>
                                    </Box>

                                    <Box
                                       sx={{
                                          paddingLeft: '25px',
                                          textAlign: 'left',
                                          '&: hover': {
                                             backgroundColor: '#eee',
                                          },
                                          '> a': {
                                             width: '100%',
                                             cursor: 'pointer',
                                             color: 'black',
                                             textDecoration: 'unset',
                                             fontSize: '14px',
                                          },
                                       }}
                                    >
                                       <Link
                                          href="#"
                                          onClick={() => {
                                             signOut();
                                             setIsVisibleTippy(false);
                                          }}
                                       >
                                          Logout
                                       </Link>
                                    </Box>
                                 </div>
                              }
                           >
                              <div ref={avatarRef}>
                                 <Avatar
                                    sx={{
                                       height: '30px',
                                       width: '30px',
                                       fontSize: '13px',
                                       '&: hover': {
                                          opacity: '1',
                                       },
                                    }}
                                    onClick={() => setIsVisibleTippy((st) => !st)}
                                 >
                                    DA
                                 </Avatar>
                              </div>
                           </Tippy>
                        </Box>
                     </>
                  ) : (
                     <>
                        <Box
                           sx={{
                              '&: hover': {
                                 opacity: 0.8,
                              },
                              '> a': {
                                 cursor: 'pointer',
                                 color: 'white',
                                 textDecoration: 'unset',
                                 fontSize: '14px',
                              },
                           }}
                        >
                           <Link href="/auth/signin">Login</Link>
                        </Box>
                     </>
                  )}
               </Toolbar>
            </Container>
         </AppBar>
      </Box>
   );
}
