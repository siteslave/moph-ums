import * as express from 'express';
import * as crypto from 'crypto';

const router = express.Router();

import { UserModel } from '../models/user';

const userModel = new UserModel();

router.get('/', async (req, res, next) => {
  let db = req.db;
  let query = req.query.query;

  let users = [];
  if (query) {
    users = await userModel.search(db, query);
  } else {
    users = await userModel.getList(db);
  }
  
  res.render('index', { title: 'Index page', users: users });
});

router.post('/', async (req, res, next) => {
  let db = req.db;
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let isActive = req.body.isActive === 'on' ? 'Y' : 'N';
  let userType = req.body.userType;

  if (username && password && firstName && lastName) {
    let data: any = {};
    data.username = username;
    data.password = crypto.createHash('md5').update(password).digest('hex');
    data.first_name = firstName;
    data.last_name = lastName;
    data.is_active = isActive;
    data.type_id = userType;

    await userModel.save(db, data);
    req.session.error = null;
    res.redirect('/');
  } else {
    req.session.error = 'ข้อมูลไม่ครบถ้วน';
    res.redirect('/new');
  }

});

router.post('/edit', async (req, res, next) => {
  let db = req.db;
  let userId = req.body.userId;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let isActive = req.body.isActive === 'on' ? 'Y' : 'N';
  let userType = req.body.userType;

  if (userId && firstName && lastName) {
    let data: any = {};
    if (password) {
      data.password = crypto.createHash('md5').update(password).digest('hex');
    }
    data.first_name = firstName;
    data.last_name = lastName;
    data.is_active = isActive;
    data.type_id = userType;

    await userModel.update(db, userId, data);
    req.session.error = null;
    res.redirect('/');
  } else {
    req.session.error = 'ข้อมูลไม่ครบถ้วน';
    res.redirect('/edit/' + userId);
  }

});

router.get('/new', async (req, res, next) => {
  let db = req.db;
  let types = await userModel.getTypes(db);
  res.render('new', { title: 'New user', types: types });
});

router.get('/edit/:userId', async (req, res, next) => {
  let db = req.db;
  let userId = req.params.userId;
  let info = await userModel.getDetail(db, userId);
  let types = await userModel.getTypes(db);
  res.render('edit', { title: 'Edit user', types: types, user: info[0] });
});

router.get('/remove/:userId', async (req, res, next) => {
  let db = req.db;
  let userId = req.params.userId;
  await userModel.remove(db, userId);
  res.redirect('/');
});

export default router;