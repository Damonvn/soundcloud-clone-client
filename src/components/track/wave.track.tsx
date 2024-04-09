'use client';
import { useWaveSurfer } from '@/utils/customHook';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Container } from '@mui/material';
import './wave.scss';
import CommentTrack from '@/components/track/comment.track';
import LikeTrack from '@/components/track/like.track';
import { sendRequest } from '@/utils/api';

interface IProps {
   track: ITrackTop | null;
   comments: ITrackComment[] | null;
}

const WaveTrack = (Props: any) => {
   const { track } = Props;
   const { comments } = Props;
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const containerRef = useRef<HTMLDivElement>(null);
   const timeRef = useRef<HTMLDivElement>(null);
   const durationRef = useRef<HTMLDivElement>(null);
   const hoverRef = useRef<HTMLDivElement>(null);
   const firstViewRef = useRef(true);
   const [increaseView, setIncreaseView] = useState<number>(0);
   const handleIncreaseView = async () => {
      if (firstViewRef.current) {
         await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `http://localhost:8000/api/v1/tracks/increase-view`,
            method: 'POST',
            body: { trackId: track?._id },
         });
         setIncreaseView(1);
         firstViewRef.current = false;
      }
   };
   const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
      let gradient;
      let progressGradient;
      if (typeof window !== 'undefined') {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d')!;

         // Define the waveform gradient
         gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
         gradient.addColorStop(0, '#656666'); // Top color
         gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
         gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
         gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
         gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
         gradient.addColorStop(1, '#B1B1B1'); // Bottom color

         // Define the progress gradient
         progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
         progressGradient.addColorStop(0, '#EE772F'); // Top color
         progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
         progressGradient.addColorStop(
            (canvas.height * 0.7 + 1) / canvas.height,
            '#ffffff',
         ); // White line
         progressGradient.addColorStop(
            (canvas.height * 0.7 + 2) / canvas.height,
            '#ffffff',
         ); // White line
         progressGradient.addColorStop(
            (canvas.height * 0.7 + 3) / canvas.height,
            '#F6B094',
         ); // Bottom color
         progressGradient.addColorStop(1, '#F6B094'); // Bottom color
      }

      return {
         waveColor: gradient,
         progressColor: progressGradient,
         barWidth: 3,
         height: 100,
         url: `/api?audio=${track?.trackUrl}`,
      };
   }, []);

   const waveSurfer = useWaveSurfer(containerRef, optionsMemo);

   const onPlayClick = useCallback(() => {
      if (waveSurfer) {
         if (waveSurfer.isPlaying() === true) {
            waveSurfer.pause();
         } else {
            waveSurfer.play();
         }
      }
   }, [waveSurfer]);

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
   };

   useEffect(() => {
      if (!waveSurfer) return;
      waveSurfer.setVolume(0.8);
      const timeEl = timeRef.current!;
      const durationEl = durationRef.current!;
      const hover = hoverRef.current!;
      const waveFrom = containerRef.current!;
      waveFrom.addEventListener(
         'pointermove',
         (e) => (hover.style.width = `${e.offsetX}px`),
      );
      const subscriptions = [
         waveSurfer.on('play', () => {
            setIsPlaying(true);
         }),
         waveSurfer.on('pause', () => {
            setIsPlaying(false);
         }),
         waveSurfer.on(
            'decode',
            (duration) => (durationEl.textContent = formatTime(duration)),
         ),
         waveSurfer.on(
            'timeupdate',
            (currentTime) => (timeEl.textContent = formatTime(currentTime)),
         ),

         // play khi có sự kiện interaction (click chuột vào track)
         // waveSurfer.once('interaction', () => {
         //    waveSurfer.play();
         // }),
      ];

      return () => {
         subscriptions.forEach((unsub) => unsub());
      };
   }, [waveSurfer]);

   return (
      <Container sx={{ pt: '40px', minHeight: 'calc(100vb + 10px)' }}>
         <div style={{ marginTop: 20 }}>
            <div
               style={{
                  display: 'flex',
                  gap: '20',
                  padding: 20,
                  background:
                     'linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)',
               }}
            >
               <div
                  style={{
                     width: '70%',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                  }}
               >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     {waveSurfer ? (
                        <div
                           onClick={() => {
                              handleIncreaseView();
                              onPlayClick();
                           }}
                           style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '50%',
                              background: '#f50',
                              height: '50px',
                              width: '50px',
                              cursor: 'pointer',
                           }}
                        >
                           {isPlaying && (
                              <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
                           )}
                           {!isPlaying && (
                              <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />
                           )}
                        </div>
                     ) : (
                        <div
                           onClick={() => {
                              onPlayClick();
                           }}
                           style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '50%',
                              background: 'transparent',
                              height: '50px',
                              width: '50px',
                              cursor: 'pointer',
                           }}
                        ></div>
                     )}
                     <div style={{ marginLeft: '10px' }}>
                        <div>
                           <span
                              style={{
                                 backgroundColor: 'rgba(0,0,0,.8)',
                                 color: '#fff',
                                 paddingLeft: '10px',
                                 paddingRight: '10px',
                                 fontWeight: 200,
                                 fontSize: '24px',
                              }}
                           >
                              {track?.title}
                           </span>
                        </div>
                        <div style={{}}>
                           <span
                              style={{
                                 backgroundColor: 'rgba(0,0,0,.8)',
                                 color: '#fff',
                                 paddingLeft: '10px',
                                 paddingRight: '10px',
                                 paddingTop: '3px',
                                 paddingBottom: '3px',
                                 fontWeight: 200,
                                 fontSize: '16px',
                              }}
                           >
                              {track?.description}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div
                     ref={containerRef}
                     className="wave-form-container"
                     style={{ position: 'relative' }}
                  >
                     <div ref={timeRef} className="time" id="time">
                        0:00
                     </div>
                     <div ref={durationRef} className="duration" id="duration">
                        0:00
                     </div>
                     <div ref={hoverRef} className="hover-wave" id="hover"></div>
                     <div
                        className="overlay"
                        style={{
                           position: 'absolute',
                           height: '30%',
                           width: '100%',
                           bottom: '0',
                           backdropFilter: 'brightness(0.5)',
                        }}
                     ></div>
                  </div>
               </div>
               <div
                  style={{
                     padding: '0px 0px 0px 30px',
                  }}
               >
                  <div
                     style={{
                        width: 320,
                        height: 320,
                        background: '#ccc',
                        backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                     }}
                  ></div>
               </div>
            </div>
         </div>
         <div style={{ marginTop: '10px' }}>
            <LikeTrack track={track} increaseView={increaseView} />
         </div>
         <div
            style={{
               width: '100%',
            }}
         >
            <CommentTrack waveSurfer={waveSurfer} track={track} comments={comments} />
         </div>
      </Container>
   );
};

export default WaveTrack;
