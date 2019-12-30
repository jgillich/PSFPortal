import express from 'express'
import * as db from './db.js'
import { get_pagination, fetch_user_middleware } from './util.js'

const api = express.Router();

api.param("user", fetch_user_middleware);

api.get('/user', async (req, res, next) => {
	try {
		const account = await db.get_account_by_id(req.session.account_id);
		res.status(200).json({ id : account.id, name: account.username, admin : account.gm });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'error' });
	}
});

api.get('/user/profile', async (req, res, next) => {
	try {
		const account = await db.get_account_by_id(req.session.account_id);
		const characters = await db.get_characters_by_account(req.session.account_id);

		res.status(200).json({
			id : account.id,
			name: account.username,
			//email : account.email, // TODO
			email : "bademail@email.com",
			account_created : account.created,
			admin : account.gm,
			characters: characters,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'error' });
	}
});


api.get('/user/:user/logins', async (req, res, next) => {
	const account = req.user;
	const pagination = get_pagination(req);

	if (account.id !== req.session.account_id) {
		res.status(403).json({ message: 'not allowed to see for other users' });
		return;
	}

	try {
		const logins = await db.get_account_logins(account.id, pagination)
		console.log(logins)
		res.status(200).json({ logins : logins, page: pagination});
	} catch (e) {
		console.log(e)
		res.status(500).json({ message: 'error' });
	}
});

export default api;