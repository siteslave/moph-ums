import * as Knex from 'knex';

export class UserModel {

  getList(db: Knex) {
    return db('users as u')
      .select('u.*', 't.type_name')
      .leftJoin('user_types as t', 't.type_id', 'u.type_id')
      .orderByRaw('first_name, last_name');
  }

  search(db: Knex, query: any) {
    let _query = `%${query}%`;

    return db('users as u')
      .select('u.*', 't.type_name')
      .leftJoin('user_types as t', 't.type_id', 'u.type_id')
      .where(w => {
        w.where('u.username', 'like', _query)
          .orWhere('u.first_name', 'like', _query)
        .orWhere('u.last_name', 'like', _query)
      })
      .orderByRaw('first_name, last_name');
  }

  getTypes(db: Knex) {
    return db('user_types')
      .orderBy('type_name');
  }

  save(db: Knex, data) {
    return db('users')
      .insert(data);
  }

  update(db: Knex, userId: any, data) {
    return db('users')
      .where('user_id', userId)
      .update(data);
  }

  remove(db: Knex, userId: any) {
    return db('users')
      .where('user_id', userId)
      .del();
  }

  getDetail(db: Knex, userId: any) {
    return db('users')
      .where('user_id', userId);
  }

  login(db: Knex, username: any, password: any) {
    return db('users')
      .where('username', username)
      .where('password', password)
      .where('is_active', 'Y');
  }
}