import object from 'joi/lib/types/object';
import pool from './pool';
/**
 *We create a model class whose constructor accept a database we
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
 *
 * @param {object} columns -  columns we want to retrieve from
 *
 * @param {object} clause - a condition such as WHERE, ON, GROUPBY etc
 *
 * @returns {obj} - it return a result of query which is a promise
 */
  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table} `;
    if (clause) query += clause;
    return this.pool.query(query);
  }

  /**
 *
 * @param {obj} columns - the table column
 *
 * @param {obj} values - the values of the column
 *
 * @returns {obj} - it help us to insert data to the database and return a promise
 * of inserted data
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
 * @param {obj} data - array od obect keys
 *
 * @param {object} clause - 
 *
 * @return {obj} - a function that update our database
 */
  async update(data, clause) {
    let query = `UPDATE ${this.table} SET `;
    const keys = Object.keys(data); // []
    let sqlQuery;
    for (const key in data) {
      if (key === keys[keys.length - 1]) {
        sqlQuery = `${key} = '${data[key]}' `;
        query += `${sqlQuery}`;
        query += `${clause}`;
        return this.pool.query(query);
      }
      sqlQuery = `${key} = '${data[key]}', `;
      query += `${sqlQuery}`;
    }
  }

  /**
 *
 * @param {object} clause - a cluse such as WHERE
 *
 * @return {obj} - a function to delete a table if clause is not provided
 */
  async deleteTableRow(clause) {
    const query = `DELETE FROM ${this.table} ${clause}`;
    return this.pool.query(query);
  }
}

export default Model;
