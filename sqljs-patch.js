const initSqlJs = require('sql.js');

const expo = {
  async init() {
    const SQL = await initSqlJs();
    SQL.verbose = function() {
      return SQL;
    }
    SQL._Database = SQL.Database;
    SQL.Database = class Db extends SQL._Database {
      constructor(filename, mode, cb) {
        super();
        process.nextTick(cb, null);
      }
      serialize(cb) {
        process.nextTick(cb);
      }
      run(sql, params, cb) {
        super.run(sql, params);
        const ctx = {};
        if (sql.toLowerCase().indexOf('insert') !== -1) {
          const rez = this.exec("select last_insert_rowid();");
          ctx.lastID = rez[0].values[0][0];
        }
        if (cb) {
          process.nextTick(cb.bind(ctx), null);
        }
        return this;
      }
      all(sql, params, cb) {
        const result = [];
        this.each(sql, params,
          (r) => { result.push(r) },
          () => { cb(null, result) });
        return this;
      }
      close () {}
    }
    expo.SQL = SQL;
  }
};

module.exports = expo;
