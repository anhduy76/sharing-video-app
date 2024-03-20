import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import { Container } from '@mui/system';
import { ApolloProvider } from "@apollo/client";
import client from "./app/apolloClient";

import './index.css'
import router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Container maxWidth="lg" sx={{textAlign: 'center'}}>
    <ApolloProvider client={client as any}>
    <RouterProvider router={router}/>
    </ApolloProvider>
    
    </Container>
  </React.StrictMode>,
)
