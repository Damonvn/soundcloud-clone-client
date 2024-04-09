'use client';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { useHasMounted } from '@/utils/customHook';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
interface IProps {
   track: ITrackTop | null;
   comments: ITrackComment[] | null;
   waveSurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
   const hasMounted = useHasMounted();
   const { data: session } = useSession();
   const { comments } = props;
   const { track } = props;
   const { waveSurfer } = props;
   const [yourComment, setYourComment] = useState('');
   const [commentsAr, setCommentsAr] = useState<ITrackComment[] | null>(null);
   useEffect(() => {
      setCommentsAr(comments);
   }, [session]);
   const handleCommentOnchange = (e: any) => {
      setYourComment(e.target.value);
   };

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
   };

   const handleSubmit = async () => {
      const res = await sendRequest<IBackendRes<ITrackComment>>({
         url: `http://localhost:8000/api/v1/comments`,
         method: 'POST',
         body: {
            content: yourComment,
            moment: Math.round(waveSurfer?.getCurrentTime() ?? 0),
            track: track?._id,
         },
         //@ts-ignore
         headers: {
            Authorization: `Bearer ${session?.access_token}`,
         },
      });

      if (res?.data) {
         setYourComment('');
         const comment = {
            //@ts-ignore
            _id: res.data._id,
            //@ts-ignore
            content: res.data.content,
            //@ts-ignore
            moment: res.data.moment,
            user: {
               _id: session?.user._id,
               email: session?.user.email,
               name: session?.user.name,
               role: session?.user.role,
               type: session?.user.type,
            },
            //@ts-ignore
            track: res.data.track,
            //@ts-ignore
            isDeleted: res.data.isDeleted,
            __v: 0,
            //@ts-ignore
            createdAt: res.data.createdAt,
            //@ts-ignore
            updatedAt: res.data.updatedAt,
         };
         const newCommentsAr = commentsAr;
         //@ts-ignore
         newCommentsAr?.unshift(comment);
         setCommentsAr(newCommentsAr);
      }
   };

   const relativeTime = require('dayjs/plugin/relativeTime');
   dayjs.extend(relativeTime);
   let dateNow = dayjs();
   //@ts-ignore
   const uploaderImgUrl = `url(${fetchDefaultImages(track.uploader.type)})`;
   return (
      <div style={{ marginTop: '15px' }}>
         <Box
            component="form"
            sx={{
               ml: '-8px',
               pr: '8px',
               mb: '15px',
               '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
         >
            <TextField
               fullWidth
               label="Comment"
               variant="standard"
               value={yourComment}
               onChange={(e) => handleCommentOnchange(e)}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     e.preventDefault();
                     handleSubmit();
                  }
               }}
            />
         </Box>
         <div style={{ display: 'flex', gap: '35px', width: '100%' }}>
            <div>
               <div
                  style={{
                     height: '140px',
                     width: '140px',
                     borderRadius: '50px',
                     background: uploaderImgUrl,
                     backgroundPosition: 'center',
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                  }}
               ></div>
               <div
                  style={{
                     fontSize: '15px',
                     fontWeight: 700,
                     textAlign: 'center',
                     opacity: 0.5,
                  }}
               >
                  {track?.uploader.email}
               </div>
            </div>
            <div style={{ flexGrow: 1 }}>
               {commentsAr &&
                  commentsAr.map((item) => {
                     return (
                        <div
                           key={item._id}
                           style={{
                              marginBottom: '25px',
                              marginTop: '15px',
                              display: 'flex',
                              justifyContent: 'space-between',
                           }}
                        >
                           <div style={{ display: 'flex', gap: '10px' }}>
                              <div>
                                 <img
                                    style={{
                                       height: 40,
                                       width: 40,
                                       borderRadius: '50%',
                                    }}
                                    src={fetchDefaultImages(item.user.type)}
                                 />
                              </div>
                              <div>
                                 <div>
                                    <span
                                       style={{
                                          fontSize: '13px',
                                          fontWeight: 600,
                                          marginRight: '10px',
                                          opacity: 0.9,
                                          color: '#999',
                                       }}
                                    >
                                       {item.user.email}
                                    </span>
                                    <span style={{ fontSize: '11px' }}>
                                       {formatTime(item.moment)}
                                    </span>
                                 </div>
                                 <div style={{ fontSize: '15px', opacity: 0.8 }}>
                                    {item.content}
                                 </div>
                              </div>
                           </div>
                           <div style={{ fontSize: '12px', color: '#999' }}>
                              {
                                 //@ts-ignore
                                 hasMounted && dateNow.to(item.createdAt)
                              }
                           </div>
                        </div>
                     );
                  })}
            </div>
         </div>
      </div>
   );
};

export default CommentTrack;
