const {Book} = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')

class BookController {
    async create(req, res, next) {
        try {
            const {name, year, genre, description, author} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const book = await Book.create({name, year, genre, description, author, img: fileName})

            res.json(book)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        const {genre, author} = req.query
        let books;
        if (!genre && !author) {
            books = await Book.findAll()
        }
        if (genre && !author) {
            books = await Book.findAll({where: {genre}})
        }
        if (!genre && author) {
            books = await Book.findAll({where: {author}})
        }
        if (genre && author) {
            books = await Book.findAll({where: {genre, author}})
        }
        return res.json(books)
    }

    async getOne(req, res) {

    }

    async update(req, res) {

    }

    async delete(req, res) {

    }
}

module.exports = new BookController()