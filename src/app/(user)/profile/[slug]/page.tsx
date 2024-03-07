import AppFooter from '@/components/footer/app.footer';
import ProfilePageContent from '@/components/profile/profile.page';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
   const tracks = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10',
      method: 'POST',
      body: {
         id: params.slug,
      },
   });

   const data = tracks?.data?.result ? tracks.data.result : null;
   return (
      <>
         <Container sx={{ pt: '86px', mb: '54px', minHeight: '100vh' }}>
            {data ? <ProfilePageContent data={data} /> : <></>}
         </Container>
      </>
   );
};

export default ProfilePage;
