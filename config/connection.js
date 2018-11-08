const dbConnection = {
    // databasename: 'postgres',
    // username: 'postgres',
    // password: 'cublick2018',
    // host: '/cloudsql/sdss-payment:asia-east1:sdsspayment',

    databasename: 'postgres',
    username: 'postgres',
    password: 'cublick2018',
    host: 'localhost',
}


const development = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };
  
  const testing = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };
  
  const production = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };
  
  module.exports = {
    development,
    testing,
    production,
  };
  