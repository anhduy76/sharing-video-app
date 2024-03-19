import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import { Container } from '@mui/system';

import './index.css'
import router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Container maxWidth="lg" sx={{textAlign: 'center'}}>
    <RouterProvider router={router}/>
    </Container>
  </React.StrictMode>,
)
