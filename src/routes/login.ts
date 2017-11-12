import * as express from 'express';
import * as crypto from 'crypto';

const router = express.Router();

import { UserModel } from '../models/user';

const userModel = new UserModel();

router.get('/', async (req, res, next) => {
  res.render('signin', { title: 'Login page' });
});

router.get('/logout', async (req, res, next) => {
  req.session.logged = false;
  req.session.fullname = null;
  res.redirect('/login');
});

router.post('/', async (req, res, next) => {
  let db = req.db;
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs = await userModel.login(db, username, encPassword);
    if (rs.length) {
      req.session.logged = true;
      req.session.fullname = `${rs[0].first_name} ${rs[0].last_name}`;
      req.session.error = null;
      res.redirect('/');
    } else {
      req.session.error = 'ชื่อผู้ใช้งาน/รหัสผ่าน ไม่ถูกต้อง';
      res.redirect('/login');
    }
  } else {
    req.session.error = 'ข้อมูลไม่ครบถ้วน';
    res.redirect('/login');
  }
});

export default router;