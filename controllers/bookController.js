const { Book } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

class BookController {
    async create(req, res, next) {
        try {
            const { name, year, genre, description, author } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const book = await Book.create({ name, year, genre, description, author, img: fileName });

            res.json(book);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const { genre, author, name, year } = req.query;
        let whereConditions = {};
        if (name) {
            whereConditions.name = {
                [Op.iLike]: `%${name}%`
            };
        }
        if (genre) {
            whereConditions.genre = genre;
        }
        if (author) {
            whereConditions.author = {
                [Op.iLike]: `%${author}%`
            };
        }
        if (year) {
            whereConditions.year = year;
        }
        const books = await Book.findAll({ where: whereConditions });
        return res.json(books);
    }


    async getOne(req, res) {
        const { id } = req.params;
        const book = await Book.findOne({ where: { id } });
        return res.json(book);
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, year, genre, description, author } = req.body;
            const book = await Book.findByPk(id);
            if (!book) {
                return next(ApiError.badRequest('Книга не найдена'));
            }

            let fileName = book.img;
            if (req.files && req.files.img) {
                const oldImagePath = path.resolve(__dirname, '..', 'static', book.img);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                fileName = uuid.v4() + '.jpg';
                req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            await book.update({ name, year, genre, description, author, img: fileName });

            res.json(book);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const book = await Book.findByPk(id);
            if (!book) {
                return next(ApiError.badRequest('Книга не найдена'));
            }

            if (book.img) {
                const imagePath = path.resolve(__dirname, '..', 'static', book.img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await book.destroy();

            res.json({ message: 'Книга удалена' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BookController();
