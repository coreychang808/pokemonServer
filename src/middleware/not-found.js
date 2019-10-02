'use strict';

module.exports = (error, req, res, next) => {
    res.status(404);
    res.statusMessage = 'Resource Not Found';
    res.json({ error: 'Not Found'})
}