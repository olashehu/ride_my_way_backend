/* eslint-disable no-restricted-syntax */
import pool from './pool';
/**
 *This is a model class whose constructor accept a database we
 wish to operate on
 */
class Model {
  /**
   *
   * @param {table} table -
   */
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  /**
 * @description - This method will fetch data from the database table.
 * it accept columns and clause as its parameter.
 *
 * @param {object} columns -  columns we want to retrieve data from
 *
 * @param {object} clause - a condition such as WHERE, ON, GROUPBY etc
 *
 * @returns {object} - it return table object
 */
  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table} `;
    if (clause) query += clause;
    return this.pool.query(query);
  }

  /**
   * @description This method puts data to the database and return the object of stored data.
   * it takes column and values as its parameter.
 *
 * @param {colum} columns - the table column
 *
 * @param {values} values - the values for the column
 *
 * @return {object} - it return table object
 */
  async insertWithReturn(columns, values) {
    const query = `
    INSERT INTO ${this.table}(${columns})
    VALUES (${values})
    RETURNING *
    `;
    return this.pool.query(query);
  }

  /**
   * @description - This method will update database table.
   *
   * @param {object} data - data object with key-value pairs to be updated
   *
   * @param {clause} clause - such as WHERE clause
   *
   * @return {object} - it return object with a message
   */
  async update(data, clause) {
    let query = `UPDATE ${this.table} SET `;
    const keys = Object.keys(data);
    let sqlQuery;
    for (const key of keys) {
      if (key === keys[keys.length - 1]) {
        sqlQuery = `"${key}" = '${data[key]}' `;
        query += `${sqlQuery}`;
        query += `${clause}`;
        return this.pool.query(query);
      }
      sqlQuery = `"${key}" = '${data[key]}',`;
      query += `${sqlQuery}`;
    }
  }

  /**
 * @description - This method will delete data from the table in database. It accept
 * clause such as WHERE clause.
 *
 * @param {clause} clause - a cluse such as WHERE
 *
 * @return {object} - it return object with a message
 */
  async deleteTableRow(clause) {
    const query = `DELETE FROM ${this.table} ${clause}`;
    return this.pool.query(query);
  }
}

export default Model;
