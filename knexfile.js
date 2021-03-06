module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/auth.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' },
  },
  testing: {
    client: 'sqlite3',
    connection: {
      filename: './data/test.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    migrations: {
      directory: './data/migrations'
    }
  }
};
