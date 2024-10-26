import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionsTable.css';

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [month, page, search]); 

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/transactions', {
        params: {
          month,
          page,
          perPage,
          search,
        },
      });
      setTransactions(response.data.transactions); 
      setTotalPages(response.data.totalPages);

      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="transactions-table mb-4">
      <input
        type="text"
        className="form-control mb-3 w-100"
        placeholder="Search transactions"
        value={search}
        onChange={handleSearch}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? 'Yes' : 'No'}</td>
                  <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={prevPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={nextPage}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
