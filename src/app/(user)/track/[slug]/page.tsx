import AppFooter from '@/components/footer/app.footer';
import CommentTrack from '@/components/track/comment.track';
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const DetailTrackPage = async (props: any) => {
   const { params } = props;

   const resGetTrack = await sendRequest<IBackendRes<ITrackTop>>({
      url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
      method: 'GET',
      nextOption: { cache: 'no-store' },
   });

   const resGetComments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
      url: `http://localhost:8000/api/v1/tracks/comments`,
      method: 'POST',
      queryParams: {
         current: 1,
         pageSize: 100,
         trackId: params.slug,
         sort: '-createdAt',
      },
   });
   const comments = resGetComments?.data?.result ?? null;
   return (
      <WaveTrack
         track={resGetTrack?.data ?? null}
         comments={resGetComments?.data?.result ?? null}
      />
   );
};
export default DetailTrackPage;
