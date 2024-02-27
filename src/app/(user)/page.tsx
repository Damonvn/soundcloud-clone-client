import MainSlider from '@/components/main/main.slider';
import { Container, Divider } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
   const session = await getServerSession(authOptions);
   const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'CHILL',
         limit: 10,
      },
   });

   const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'WORKOUT',
         limit: 10,
      },
   });

   const party = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: 'http://localhost:8000/api/v1/tracks/top',
      method: 'POST',
      body: {
         category: 'PARTY',
         limit: 10,
      },
   });

   return (
      <Container>
         <div style={{ paddingTop: '46px', marginBottom: '76px' }}>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
               <div style={{ display: 'flex' }}>
                  <div style={{ width: '70%' }}>
                     <MainSlider data={chills?.data ?? []} title={'Top Chill'} />
                     <Divider />
                     <MainSlider data={workouts?.data ?? []} title={'Top Workout'} />
                     <Divider />
                     <MainSlider data={party?.data ?? []} title={'Top Party'} />
                  </div>
                  <div style={{ width: '30%' }}>
                     <div
                        style={{
                           marginLeft: 20,
                           paddingLeft: 20,
                           borderLeft: '1px solid #eee',
                           height: '100%',
                        }}
                     ></div>
                  </div>
               </div>
            </div>
         </div>
      </Container>
   );
}
