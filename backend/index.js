const express = require('express');
const axios = require('axios');
const db = require('./db'); 
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'views');


app.get('/', (req, res) => {
  res.render('dashboard');
});

// Initialize the database 
app.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;

  
    db.query('TRUNCATE TABLE transactions', (err) => {
      if (err) throw err;
    });


    const sql = 'INSERT INTO transactions (title, description, price, category, sold, dateOfSale) VALUES ?';
    const values = products.map(item => [
      item.title,
      item.description,
      item.price,
      item.category,
      item.sold ? 1 : 0,
      item.dateOfSale
    ]);

    db.query(sql, [values], (err) => {
      if (err) throw err;
      res.send('Database initialized with product data');
    });
  } catch (error) {
    res.status(500).send('Error initializing the database');
  }
});
// Get paginated transactions 
app.get('/transactions', (req, res) => {
  // Parse query parameters, with page and perPage as integers
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const search = req.query.search || '';
  const month = req.query.month;

  let query = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (month) {
    query += ' AND MONTH(dateOfSale) = ?';
    params.push(month);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR price LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' LIMIT ?, ?';
  params.push((page - 1) * perPage, perPage);

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE 1=1';
    const countParams = params.slice(0, params.length - 2); // Use same params without limit & offset

    db.query(countQuery, countParams, (err, countResult) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / perPage);

      res.json({
        transactions: results,
        total,
        currentPage: page,
        totalPages
      });
    });
  });
});

//  get sales statistics
app.get('/statistics', (req, res) => {
  const { month } = req.query;

  const soldQuery = 'SELECT SUM(price) as totalAmount, COUNT(*) as totalSold FROM transactions WHERE sold = 1 AND MONTH(dateOfSale) = ?';
  const notSoldQuery = 'SELECT COUNT(*) as totalNotSold FROM transactions WHERE sold = 0 AND MONTH(dateOfSale) = ?';

  db.query(soldQuery, [month], (err, soldResult) => {
    if (err) throw err;

    db.query(notSoldQuery, [month], (err, notSoldResult) => {
      if (err) throw err;

      res.json({
        totalSaleAmount: soldResult[0].totalAmount || 0,
        totalSold: soldResult[0].totalSold || 0,
        totalNotSold: notSoldResult[0].totalNotSold || 0
      });
    });
  });
});

// Route to  price range statistics
app.get('/price-range', (req, res) => {
  const { month } = req.query;

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: 10000 }
  ];

  const results = [];
  priceRanges.forEach((range, index) => {
    db.query(
      'SELECT COUNT(*) as count FROM transactions WHERE price BETWEEN ? AND ? AND MONTH(dateOfSale) = ?',
      [range.min, range.max, month],
      (err, countResult) => {
        if (err) throw err;
        results.push({ range: range.range, count: countResult[0].count });

        if (index === priceRanges.length - 1) {
          res.json(results);
        }
      }
    );
  });
});

// Route  category data
app.get('/categories', (req, res) => {
  const { month } = req.query;

  db.query(
    'SELECT category, COUNT(*) as count FROM transactions WHERE MONTH(dateOfSale) = ? GROUP BY category',
    [month],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

// get combined statistics data
app.get('/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const statistics = await axios.get(`http://localhost:5000/statistics?month=${month}`);
    const priceRange = await axios.get(`http://localhost:5000/price-range?month=${month}`);
    const categories = await axios.get(`http://localhost:5000/categories?month=${month}`);

    res.json({
      statistics: statistics.data,
      priceRange: priceRange.data,
      categories: categories.data
    });
  } catch (error) {
    res.status(500).send('Error fetching combined data');
  }
});

// Start  server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
