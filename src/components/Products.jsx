import React, { useState, useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import {db} from '../firebase/appConfig'
import { collection, deleteDoc, doc, onSnapshot, updateDoc, addDoc } from 'firebase/firestore'
import Swal from 'sweetalert2';

const initialProducts = [
  { id: 1, name: 'Product 1', description: 'Description for product 1' },
  { id: 2, name: 'Product 2', description: 'Description for product 2' },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });


  useEffect(() => {
    //Funcion que nos permite visualizar la info de la bd en tiempo real
    onSnapshot(
        //obtenemos la conexion de la base de datos y el nombre de la coleccion
        collection(db, "products"),
        (snapshot) => {
            
            //console.log(snapshot.docs[0].data());
            
            /** mapeando / iterando los documentos de la coleccion */
            const array_products = snapshot.docs.map((doc) => {
                //copiamos la data de cada documento de la coleccion productos y la mandamos al array_products
                return {...doc.data(), id: doc.id}
            })
            //testear 
            //console.log(array_products);
            
            //actualizamos el estado con el arreglo de productos
            setProducts(array_products)
        }
    )
  }, [])

  // Funciones para abrir el modal, dependiendo si se va a editar o agregar un producto
  const handleOpen = (product = null) => {
    if (product) {
      setFormData({ name: product.name, description: product.description });
      setEditingProduct(product);
    } else {
      setFormData({ name: '', description: '' });
      setEditingProduct(null);
    }
    setOpen(true);
  };

  // Funcion para cerrar el modal
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '' });
    setEditingProduct(null);
  };

  // Funcion para agregar o editar un producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {


      //actualizamos el producto, seleccionamos el documento por su id, 
      // y actualizamos los campos name y description en Firebase
      editProduct();

      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData }
          : p
      ));

    } else {

      //guardamos el nuevo producto, seleccionamos el documento por su id, 
      // y actualizamos los campos name y description en Firebase
      saveProduct();

      setProducts([
        ...products,
        {
          id: products.length + 1,
          ...formData
        }
      ]);
    }




    handleClose();
  };

  // funcion para actualizar un producto en Firebase
  const editProduct = async () => {
    try{
          //actualizamos el producto, seleccionamos el documento por su id
          updateDoc(doc(db, "products", editingProduct.id), {
              name: formData.name,
              description: formData.description
          });
          
      }catch(error){
          console.error('Error al actualizar el producto', error)
      }
  }

  // funcion para guardar el nuevo producto en Firebase
  const saveProduct = async () => {

    //conectarnos a la bd y guardamos un documento
    try{
        await addDoc(collection(db, "products"), {
            name: formData.name, 
            description: formData.description 
        })
    }catch(error){
        console.error("Error al registrar el producto", error)
    }
    
  }

  // funcion para eliminar un producto
  const handleDelete = (id) => {

    try{
      Swal.fire({
          title: "estas seguro de borrar?",
          text: "tu no podras revertir esto",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, Borrarlo!"
        }).then((result) => {
          if (result.isConfirmed) {
              //eliminar el documento
              setProducts(products.filter(p => p.id !== id));
              deleteDoc(doc(db, "products", id));
              Swal.fire({
                  title: "Borrado!",
                  text: "tu registro ha sido borrado",
                  icon: "success"
              });
          }
      });

  }catch(error){
      console.error("Error al eliminar un producto",error)
  }

    
  };

  // Desktop view - Table
  const DesktopView = () => (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>
              <Stack direction="row" spacing={1}>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => handleOpen(product)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // en Vista de Mobile pasamos a una vista de Cards
  const MobileView = () => (
    <Stack spacing={2}>
      {products.map((product) => (
        <Card key={product.id} variant="outlined">
          <Typography level="h4">{product.name}</Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              color="primary"
              onClick={() => handleOpen(product)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="danger"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Sheet sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Typography level="h4">Productos</Typography>
        <Button onClick={() => handleOpen()}>Agregar Producto</Button>
      </Stack>

      {/* este bloque muestra ya sea la vista de escritorio o la vista móvil */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DesktopView />
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileView />
      </Box>
      {/* termina bloque que muestra ya sea la vista de escritorio o la vista móvil */}

      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            width: { xs: '90%', sm: 400 },
            maxWidth: '100%',
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </FormControl>

              <Button type="submit">
                {editingProduct ? 'Actualizar' : 'Agregar'}
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}

export default Products;