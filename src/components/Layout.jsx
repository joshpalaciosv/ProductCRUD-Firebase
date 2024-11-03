import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import Sheet from '@mui/joy/Sheet';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/joy/Typography';
import Drawer from '@mui/joy/Drawer';
import Box from '@mui/joy/Box';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';

// Layout component, se recibe el estado de autenticacion
function Layout({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // funcion para cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const isCurrentPath = (path) => location.pathname === path;

  // NavContent component que contiene el menu de navegacion
  const NavContent = () => (
    <Sheet
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        level="h4"
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        Dashboard
      </Typography>
      
      <List
        sx={{
          '--ListItem-radius': '8px',
          '--ListItem-minHeight': '48px',
          '--List-gap': '8px',
          px: 2,
        }}
      >
        <ListItem>
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => setDrawerOpen(false)}
            selected={isCurrentPath('/')}
            sx={{
              fontWeight: 'lg',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <HomeIcon />
            Principal
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/products"
            // se utiliza el estado setDrawerOpen para cerrar/abrir el menu
            selected={isCurrentPath('/products')}
            sx={{
              fontWeight: 'lg',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Inventory2Icon />
            Products
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          color="danger"
          onClick={handleLogout}
          fullWidth
          variant="soft"
          size="lg"
        >
          Logout
        </Button>
      </Box>
    </Sheet>
  );

  // se definen las siguiente constantest para definir el ancho del sidebar, el alto del header en mobile
  const SIDEBAR_WIDTH = 280;
  const MOBILE_HEADER_HEIGHT = 64;

  return (
    <Sheet
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* menu en pantalla Desktop */}
      <Sheet
        sx={{
          width: SIDEBAR_WIDTH,
          display: { xs: 'none', md: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider',
          position: 'fixed',
          height: '100vh',
          overflow: 'auto',
          
        }}
      >
        <NavContent />
      </Sheet>

      {/* Vista Mobile */}
      <Sheet
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: MOBILE_HEADER_HEIGHT,
          zIndex: 1000,
          bgcolor: 'background.surface',
        }}
      >
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography level="h4">Dashboard</Typography>
      </Sheet>

      {/* Menu para Mobile */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <NavContent />
      </Drawer>

      {/* Contenido Principal */}
      <Sheet
        sx={{
          flexGrow: 1,
          width: 'auto',
          //width: '135vh',
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          mt: { xs: `${MOBILE_HEADER_HEIGHT}px`, md: 0 },
          overflow: 'auto',
          minHeight: '100vh',
          p: 3,
          // backgroundColor: 'rgba(255, 0, 255, 0.1)', // Light red background
          // outline: '5px solid blue', // Blue outline
        }}
      >
        <Outlet />
      </Sheet>
    </Sheet>
  );
}

export default Layout;