'use client';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IProps {
   likes: ITrackTop[] | null;
}

const LikeTrack = (props: IProps) => {
   const { likes } = props;
   const [likedTrack, setLikedTrack] = useState<ITrackTop[] | null>([]);
   useEffect(() => {
      setLikedTrack(likes);
   }, []);
   return (
      <Box sx={{ mt: 3, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
         {likedTrack?.map((track) => {
            return (
               <Box key={track._id}>
                  <div
                     style={{
                        borderRadius: '3px',
                        height: 200,
                        width: 200,
                        marginBottom: '10px',
                        background: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                     }}
                  />
                  <div>
                     <Link
                        style={{ textDecoration: 'none', color: 'unset' }}
                        href={`/track/${track._id}?audio=${track.trackUrl}&${track._id}`}
                     >
                        <span
                           style={{
                              width: '200px',
                              display: 'block',
                              color: 'black',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                           }}
                        >
                           {track.title}
                        </span>
                     </Link>
                  </div>
               </Box>
            );
         })}
      </Box>
   );
};

export default LikeTrack;
