import UploadTabs from '@/components/track/upload.tabs';
import { Container } from '@mui/material';

const UploadPage = () => {
   return (
      <Container sx={{ paddingTop: '50px', minWidth: '100vh', minHeight: 'calc(100vh + 5px)' }}>
         <UploadTabs />
      </Container>
   );
};

export default UploadPage;
