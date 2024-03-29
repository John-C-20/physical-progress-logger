const  Workout  = require("../models/Workout.js");


const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({user_id: req.query.user_id});
        console.log(workouts)
        res.status(200).send(workouts)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

const getWorkout = async (req, res) => {
    // Use req.params instead of req.body here because axios does not allow us to
    // send data through req.body. We have to send it through the query header instead
    try {
        const id = await req.params.id
        const workout = await Workout.find({ _id: id });
        res.status(200).send(workout)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

const addWorkout = async (req, res) => {
    // req.body is fine here bc this is a POST route
    try {
        const body = await req.body
        const workout = await Workout.create(body)
        res.status(200).send(workout)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

module.exports = {
    getWorkouts,
    getWorkout,
    addWorkout
}
