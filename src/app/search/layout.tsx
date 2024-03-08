import AppHeader from '@/components/header/app.header';

export default function RootLayout(props: any) {
   const { children } = props;
   return (
      <html lang="en">
         <body>
            <>
               <AppHeader />
               {children}
            </>
         </body>
      </html>
   );
}
