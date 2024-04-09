import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useHasMounted } from '@/utils/customHook';

interface IProps {
   track: ITrackTop | null;
   increaseView: number;
}

const LikeTrack = (props: IProps) => {
   const { track } = props;
   const { increaseView } = props;
   const { data: session } = useSession();
   const hasMounted = useHasMounted();
   const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
   const [countLike, setCountLike] = useState<number>(0);

   const fetchData = async () => {
      if (session?.access_token) {
         const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike[] | null>>>(
            {
               url: `http://localhost:8000/api/v1/likes`,
               method: 'GET',
               queryParams: { current: 1, pageSize: 100, sort: '-createdAt' },
               headers: { Authorization: `Bearer ${session?.access_token}` },
            },
         );
         if (res2?.data?.result) {
            //@ts-ignore
            setTrackLikes(res2?.data?.result);
         }
      }
   };

   const handleLikeTrack = async () => {
      const copyTrackLikes = trackLikes;
      const likeStatus = copyTrackLikes?.some((t) => t._id === track?._id);
      if (trackLikes) {
         const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `http://localhost:8000/api/v1/likes`,
            method: 'POST',
            body: {
               track: track?._id,
               quantity: likeStatus ? -1 : 1,
            },
            headers: { Authorization: `Bearer ${session?.access_token}` },
         });

         if (likeStatus) {
            //@ts-ignore
            const newTrackLikes = copyTrackLikes.filter((t) => t._id !== track?._id);
            setTrackLikes(newTrackLikes);
            setCountLike((prev) => prev - 1);
         } else {
            //@ts-ignore

            const addTrack = {
               _id: track?._id,
               title: track?.title,
               description: track?.description,
               category: track?.category,
               imgUrl: track?.imgUrl,
               trackUrl: track?.trackUrl,
               countLike: track?.countLike ? track?.countLike + 1 : 1,
               countPlay: track?.countPlay ? track?.countPlay + 1 : 1,
               createdAt: track?.createdAt,
               updatedAt: track?.updatedAt,
            };
            //@ts-ignore
            setTrackLikes((prev) => [...prev, addTrack]);
            setCountLike((prev) => prev + 1);
         }
      }
   };

   useEffect(() => {
      fetchData();
      //@ts-ignore
      setCountLike(track?.countLike);
   }, [session]);

   return (
      <Stack direction="row" justifyContent="space-between" alignItems="center">
         <Chip
            sx={{
               pl: '10px',
               pr: '5px',
               borderRadius: '15px',
               '&: hover': {
                  cursor: 'pointer',
                  opacity: 0.9,
               },
            }}
            variant="outlined"
            color={trackLikes?.some((t) => t._id === track?._id) ? 'error' : 'default'}
            icon={<FavoriteIcon />}
            label="Like"
            onClick={() => handleLikeTrack()}
         ></Chip>
         <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            rowGap="50px"
         >
            {hasMounted && (
               <>
                  <Chip
                     variant="outlined"
                     icon={
                        <PlayCircleOutlineIcon
                           fontSize="inherit"
                           sx={{ fontSize: '21px' }}
                        />
                     }
                     label={
                        track?.countPlay ? track?.countPlay + increaseView : increaseView
                     }
                     sx={{ border: 'none', fontSize: '11px' }}
                  ></Chip>
                  <Chip
                     variant="outlined"
                     icon={<FavoriteBorderIcon fontSize="small" />}
                     label={countLike.toString()}
                     sx={{ border: 'none', fontSize: '11px' }}
                  ></Chip>
               </>
            )}
         </Stack>
      </Stack>
   );
};

export default LikeTrack;
