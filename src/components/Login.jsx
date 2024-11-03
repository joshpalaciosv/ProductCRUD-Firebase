import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { auth_user } from '../firebase/appConfig';


function Login({ setIsAuthenticated }) {
  // utilizando react-hook-form
  const { register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();

  //funcion para enviar los datos del formulario
  const onSubmit = async (data) => {
        //se validan credenciales con Firebase
        try {
            const userCredentiales = await signInWithEmailAndPassword(auth_user, data.email, data.password);
            const user = userCredentiales.user;
            // se guarda el flag que el usuario se encuentra autenticado
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            navigate('/');


        } catch (error) {
            console.error(error.message)
            Swal.fire({
                title: "Credenciales Invalidas",
                text: "Revisa tu informacion",
                icon: "warning"
            });
        }
  };

  

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #f0f0f0 0%, #ffffff 100%)',
      }}
    >
      <Sheet
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: {
            xs: 'calc(100% - 32px)', // personalizando en vista Mobile
            sm: '400px', // personalizando en pantallas mas grandes que Mobile.
          },
          mx: 'auto',
          p: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 'lg',
          boxShadow: 'lg',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          level="h2"
          component="h1"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontSize: {
              xs: 'xl2',
              sm: 'xl3',
            },
          }}
        >
         CRUD Products
        </Typography>
        
        {/* se define el form control para el login del usuario */}
        <FormControl>
          <FormLabel>Usuario</FormLabel>
          <Input
            type="email" 
            placeholder="Ingrese su correo"
            {...register('email', { required: 'email es requerido',
              // validamos que el formato del email sea correcto
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Formato de email no es válido'}
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </FormControl>

        <FormControl>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            placeholder="Ingrese su contraseña"
            {...register('password', { required: 'contraseña es requerida' })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </FormControl>
          
          {/* boton de submit */} 
        <Button
          type="submit"
          size="lg"
          sx={{
            mt: 2,
            '--Button-radius': '8px',
            background: 'linear-gradient(45deg, #007FFF 0%, #0059B2 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0059B2 0%, #004C99 100%)',
            },
          }}
        >
          Ingresar
        </Button>
      </Sheet>
    </Box>
  );
}

export default Login;