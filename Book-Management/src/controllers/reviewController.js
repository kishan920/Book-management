const moment = require('moment')
const validate = require("../validation/validator")
const bookModel = require("../models/bookModel")
const reviewModel = require('../models/reviewModel')


const createReview = async function (req, res) {
    try {
        const requestBody = req.body;
        const bookId = req.params.bookId
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null });
        
        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid parameters!!. Please provide review details' })
            return
        }
        if(!validate.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is an invalid book id` })
        }
        if (!book) {
            res.status(400).send({ status: false, message: `bookId does not exists` })
            return
        }
        const { reviewedBy, review, rating ,reviewedAt } = requestBody;
        if (!validate.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: ' please provide valid bookId ' })
            return
        }

        if (!validate.isValid(rating)) {
            res.status(400).send({ status: false, message: ' Please provide a valid rating' })
            return
        }
        
        if (!validate.validateRating(rating)) {
            res.status(400).send({ status: false, message: 'rating should be between 1 to 5 integers' })
            return
        }     
        if (!validate.isValid(review)) {
            res.status(400).send({ status: false, message: ' Please provide a review' })
            return
        }
        if(!validate.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: `Review date is required`})
        }

        if(!validate.isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: `${reviewedAt} is an invalid date`})
        }

        const newReview = await reviewModel.create( {
            bookId: bookId,
            reviewedBy: reviewedBy ? reviewedBy : "Guest",
            reviewedAt: moment(reviewedAt).toISOString(),
            rating: rating,
            review: review

        })

        book.reviews = book.reviews + 1
        await book.save()

        const data = book.toObject()
        data['reviewsData'] = newReview
        res.status(201).send({ status: true, message: 'review added successfully for this bookId', data: data })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}

const updateReview = async function (req, res) {
    try {
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        if (!validate.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId}is​​​not a valid bookId id` })
            return
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            res.status(400).send({ status: false, message: `book does not exists` })
            return
        }
        if (!validate.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId}​​​​​​is not a valid reviewId id` })
            return
        }
        
        const fetchReview = await reviewModel.findOne({ _id: reviewId ,isDeleted: false })
        if (!fetchReview) {
            res.status(400).send({ status: false, message: `Review does not exists` })
            return
        }
        const data = book.toObject()
        data['reviewsData'] = fetchReview

        if (!validate.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Review unmodified', data: data })
        }

        const { reviewedBy, review, rating } = requestBody;
        updatedReviewData = {}

        if (validate.isValid(reviewedBy)) {
            updatedReviewData['reviewedBy'] = reviewedBy.trim()
        }
            
        if (validate.isValid(rating)) {        
        if (!validate.validateRating(rating)) {              
            res.status(400).send({ status: false, message: 'rating should be between 1 to 5 integers' })
            return
            }      
            updatedReviewData['rating'] = rating
        }

        if (validate.isValid(review)){
           updatedReviewData['review'] = review
        }
        
        const updateReview = await reviewModel.findOneAndUpdate(fetchReview, updatedReviewData, { new: true })
        
        data['reviewsData'] = updateReview

        res.status(200).send({ status: true, message: 'review updated successfully', data: data  });

    } catch (e) {
        res.status(500).send({ status: false, message: e.message })
    }
}
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!(validate.isValid(bookId) && validate.isValid(reviewId))) {
            return res.status(400).send({ status: false, msg: "params Id is not valid" })
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false})

        if(!book) return res.status(404).send({ status: false, message: 'Book not found'})

        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId })

        if (!review) {
            res.status(404).send({ status: false, message: ` review not found` })
            return
        }
        let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false, deletedAt: null },
            { isDeleted: true, deletedAt: new Date() }, { new: true })
            
        if(!deleteReview) {
            res.status(404).send({ status: false, msg: "review is alredy deleted" })
            return
        }
        book.reviews = book.reviews === 0 ? 0 : book.reviews - 1
        await book.save()

        res.status(200).send({ status: true, msg: "Review has been deleted successfully" })
        

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};



module.exports = { createReview, updateReview, deleteReview }