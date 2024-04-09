import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import LikeTrack from '@/components/like/like.tracks';

export const metadata: Metadata = {
   title: 'Tracks bạn đã liked',
   description: 'miêu tả thôi mà',
};

const LikePage = async () => {
   const session = await getServerSession(authOptions);

   const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: 'GET',
      queryParams: { current: 1, pageSize: 100 },
      headers: {
         Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
         next: { tags: ['liked-by-user'] },
      },
   });
   const likes = res.data?.result;
   return (
      <Container sx={{ pt: '66px', height: 'calc(100vh + 10px)' }}>
         <div>
            <h3>Hear the tracks you've liked:</h3>
         </div>
         <Divider />
         {/* <LikeTrack likes={likes} /> */}
      </Container>
   );
};

export default LikePage;
