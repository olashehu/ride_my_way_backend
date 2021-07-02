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
 * it accept columns and clause.
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
   * @description This method will store data to the database and return the object of stored data.
   * it accept column and values.
 *
 * @param {colum} columns - the table column
 *
 * @param {values} values - the values for the the column
 *
 * @return {object} -  it return a promise of object data
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
   * @description - This method will update database table. It accept
   * data as parameter which is information you are updating, and clause
   * such as WHERE
   *
   * @param {object} data - object containing information to be updated
   *
   * @param {clause} clause - such as WHERE clause
   *
   * @return {message} - "success" if user object is validated and is valid
   */
  async update(data, clause) {
    let query = `UPDATE ${this.table} SET `;
    const keys = Object.keys(data); // []
    let sqlQuery;
    // eslint-disable-next-line no-restricted-syntax
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
 * @return {message} - it return a success message if the id of the user is valid
 *otherwise "failed to delete your id does not match"
 */
  async deleteTableRow(clause) {
    const query = `DELETE FROM ${this.table} ${clause}`;
    return this.pool.query(query);
  }
}

export default Model;
