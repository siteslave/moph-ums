import express = require('express');
import Knex = require('knex');

declare global {
  namespace Express {
    export interface Request {
      db: Knex;
      session: any;
    }
  }
}