/* eslint-disable no-restricted-syntax */
import pool from './pool';
/**
 *This is a model class whose constructor accept a database we
 wish to operate on
 */
class ModelTwo {
  /**
   *
   * @param {table} table -
   */
  constructor(tableOne, tableTwo) {
    this.pool = pool;
    this.tableOne = tableOne;
    this.tableTwo = tableTwo;
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
  async selectJoin(columns, paramOne, paramTwo, clause) {
    let query = `SELECT ${columns} FROM ${this.tableOne}
    LEFT JOIN ${this.tableTwo} ON ${this.tableOne}."${paramOne}" = ${this.tableTwo}."${paramTwo}"`;
    if (clause) query += clause;
    return this.pool.query(query);
  }
}

export default ModelTwo;
