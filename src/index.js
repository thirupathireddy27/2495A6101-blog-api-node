require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { sequelize } = require('./models');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');

const app = express();
app.use(express.json());

app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.status) return res.status(err.status).json({ error: err.message });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await sequelize.authenticate();
    console.log('DB OK');
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })().catch(err => { console.error(err); process.exit(1); });
}

module.exports = app;
