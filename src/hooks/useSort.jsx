import { useState } from 'react';

const useSort = () => {
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState(null);

    const sortData = (data, columnId, sortOrder, setSortedData) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        let sorted;

        if (columnId === 'duration') {
            sorted = [...data].sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return newSortOrder === 'asc' ? durationA - durationB : durationB - durationA;
            });
        } else if (columnId === 'direct') {
            sorted = [...data].sort((a, b) => newSortOrder === 'asc' ? a.direct - b.direct : b.direct - a.direct);
        } else if (columnId === 'price'){
            sorted = [...data].sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ''));
                return newSortOrder === 'asc' ? priceA - priceB : priceB - priceA;
            });
        }
        else if (columnId === 'departure' || columnId === 'returnDate') {
            sorted = [...data].sort((a, b) => {
                const dateA = a[columnId];
                const dateB = b[columnId];
                return newSortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
            });
        }
        else {
            sorted = data;
        }

        setSortedData(sorted);
        return newSortOrder;
    };

    const parseDuration = (duration) => {
        const [hours, minutes] = duration.split('h').map((value) => parseInt(value, 10));
        return hours * 60 + minutes;
    };

    return {
        sortOrder,
        sortColumn,
        setSortOrder,
        setSortColumn,
        sortData
    };
};
export default useSort;