import React from 'react';
import { useQuery } from '@apollo/client';
import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { EXCHANGE_RATES_QUERY } from '../graphql/exchangeRatesQuery';
import { ExchangeRatesData } from '../types/exchangeRates';

const ExchangeRatesTable: React.FC = () => {
    const { data, loading, error } = useQuery<ExchangeRatesData>(EXCHANGE_RATES_QUERY);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={4}>
                <Alert severity="error">Error loading exchange rates: {error.message}</Alert>
            </Box>
        );
    }

    const { rates, lastUpdated } = data?.exchangeRates ?? {
        rates: [],
        lastUpdated: '',
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Czech National Bank Exchange Rates
            </Typography>

            <Box
                sx={{
                    backgroundColor: '#e8f5e9',
                    borderRadius: 1,
                    p: 2,
                    mb: 3,
                    textAlign: 'center',
                    color: 'text.secondary',
                }}
            >
                <Typography variant="caption">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>
                                <strong>Country</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Currency</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Amount</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Code</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Rate (CZK)</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rates.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.country}</TableCell>
                                <TableCell>{row.currency}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>
                                    <a
                                        href={`https://www.xe.com/currency/${row.currencyCode}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#1976d2', textDecoration: 'none' }}
                                    >
                                        {row.currencyCode}
                                    </a>
                                </TableCell>
                                <TableCell sx={{ color: 'green', fontWeight: 500 }}>
                                    {row.rate.toFixed(4)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ExchangeRatesTable;
