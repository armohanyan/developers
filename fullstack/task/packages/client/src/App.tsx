import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import ExchangeRatesTable from './components/ExchangeRatesTable';

const App: React.FC = () => {
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md">
                <ExchangeRatesTable />
            </Container>
        </>
    );
};

export default App;
