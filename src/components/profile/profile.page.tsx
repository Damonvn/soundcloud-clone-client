'use client';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import AppFooter from '../footer/app.footer';

const initialTrack = {
   _id: '',
   title: '',
   description: '',
   category: '',
   imgUrl: '',
   trackUrl: '',
   countLike: 0,
   countPlay: 0,
   uploader: {
      _id: '',
      email: '',
      name: '',
      role: '',
      type: '',
   },
   isDeleted: false,
   createdAt: '',
   updatedAt: '',
   isPlaying: false,
};
const ProfilePageContent = ({ data }: { data: ITrackTop[] }) => {
   const [tracksData, setTracksData] = useState<ITrackTop[] | null>(null);
   const theme = useTheme();
   const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initialTrack);

   useEffect(() => {
      setTracksData(data);
   }, [data]);

   return (
      <>
         <Grid
            sx={{
               marginLeft: '-50px',
               marginRight: '-50px',
            }}
         >
            <Grid container>
               {tracksData &&
                  tracksData.map((item, index) => {
                     return (
                        <Grid
                           item={true}
                           md={6}
                           sx={{
                              mb: '50px',
                              pl: '50px',
                              pr: '50px',
                           }}
                           key={item._id}
                        >
                           <Card
                              sx={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                              }}
                           >
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                 <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography
                                       sx={{
                                          fontSize: '18px',
                                          fontWeight: 400,
                                          cursor: 'pointer',
                                          width: '340px',
                                          height: '30px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                       }}
                                       component="div"
                                       variant="h5"
                                       onClick={() => {
                                          window.location.href = `http://localhost:3000/track/${item._id}?audio=${item.trackUrl}&id=${item._id}`;
                                       }}
                                    >
                                       {item.title}
                                    </Typography>
                                    <Typography
                                       sx={{
                                          fontSize: '14px',
                                       }}
                                       variant="subtitle1"
                                       color="text.secondary"
                                       component="div"
                                    >
                                       {item.category}
                                    </Typography>
                                 </CardContent>
                                 <Box
                                    sx={{
                                       display: 'flex',
                                       alignItems: 'center',
                                       pl: 1,
                                       pb: 1,
                                    }}
                                 >
                                    <IconButton aria-label="previous">
                                       {theme.direction === 'rtl' ? (
                                          <SkipNextIcon />
                                       ) : (
                                          <SkipPreviousIcon />
                                       )}
                                    </IconButton>
                                    {(item._id !== currentTrack._id ||
                                       (item._id === currentTrack._id &&
                                          currentTrack.isPlaying === false)) && (
                                       <IconButton
                                          aria-label="play/pause"
                                          onClick={() =>
                                             setCurrentTrack({
                                                ...item,
                                                isPlaying: true,
                                             })
                                          }
                                       >
                                          <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                                       </IconButton>
                                    )}
                                    {item._id === currentTrack._id &&
                                       currentTrack.isPlaying === true && (
                                          <IconButton
                                             aria-label="play/pause"
                                             onClick={() =>
                                                setCurrentTrack({
                                                   ...item,
                                                   isPlaying: false,
                                                })
                                             }
                                          >
                                             <PauseIcon sx={{ height: 38, width: 38 }} />
                                          </IconButton>
                                       )}

                                    <IconButton aria-label="next">
                                       {theme.direction === 'rtl' ? (
                                          <SkipPreviousIcon />
                                       ) : (
                                          <SkipNextIcon />
                                       )}
                                    </IconButton>
                                 </Box>
                              </Box>
                              <CardMedia
                                 component="img"
                                 sx={{ width: 151 }}
                                 image={`http://localhost:8000/images/${item.imgUrl}`}
                                 alt="Live from space album cover"
                              />
                           </Card>
                        </Grid>
                     );
                  })}
            </Grid>
         </Grid>
         {currentTrack?._id && (
            <AppFooter currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
         )}
      </>
   );
};

export default ProfilePageContent;
