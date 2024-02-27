'use client';
import './app.footer.scss';
import { useHasMounted } from '../../utils/customHook';
import { AppBar, Box, Container } from '@mui/material';
import { useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
   const playerRef = useRef(null);
   const hasMounted = useHasMounted();
   if (!hasMounted) return <></>;

   return (
      <Box>
         <AppBar
            position="fixed"
            color="primary"
            sx={{
               top: 'auto',
               bottom: 0,
               backgroundColor: '#f2f2f2',
               borderTop: '1px solid #cecece',
               marginTop: '300spx',
               '.rhap_container': {
                  padding: '3px 15px',
               },
            }}
         >
            <Container
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '5px',
                  paddingBottom: '5px',
               }}
            >
               <AudioPlayer
                  className="app-footer-audioPlayer"
                  ref={playerRef}
                  style={{
                     backgroundColor: '#f2f2f2',
                     boxShadow: 'none',
                     width: '80%',
                     marginLeft: '-14px',
                     marginRight: '50px',
                  }}
                  autoPlay={false}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/30-sec-acoustic-heartfelt-bluegrass-southern-cooking-SBA-346744617-1704000176925.mp3`}
                  volume={0.5}
                  // other props here
               />

               <div
                  style={{
                     color: '#666',
                     width: '20%',
                     overflow: 'hidden',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'start',
                  }}
               >
                  <div
                     style={{
                        fontSize: '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                     }}
                  >
                     Song's name: hardcode
                  </div>
                  <div
                     style={{
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                     }}
                  >
                     Song's information
                  </div>
               </div>
            </Container>
         </AppBar>
      </Box>
   );
};

export default AppFooter;
