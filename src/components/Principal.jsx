import React from 'react';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';

function Principal() {

  // Utilizamos una funcion para el contenido de la vista en desktop
  const DesktopView = () => (
    <Table>
      <tbody>
       
       {/* <Sheet sx={{ p: 4, textAlign: 'center'}}> */}
        <Typography level="h2">Bienvenido al CRUD de Productos</Typography>
         <Typography level="body-lg" sx={{ mt: 2 }}>
             Este es tu dashboard de inicio. Navega usando el menú de la izquierda.
         </Typography>
       {/* </Sheet> */}
       
      </tbody>
    </Table>
  );

  // dependiendo de la vista se muestra el contenido de la vista en desktop o en mobile
  return (
    <Sheet sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
         <DesktopView />
       </Box>  
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <Sheet sx={{ p: 4, textAlign: 'center'}}>
        <Typography level="h2">Bienvenido al CRUD de Productos</Typography>
         <Typography level="body-lg" sx={{ mt: 2 }}>
         Este es tu dashboard de inicio. Navega usando el menú de la izquierda.
         </Typography>
       </Sheet>
      </Box>
    </Sheet>
   
  );
}

export default Principal;