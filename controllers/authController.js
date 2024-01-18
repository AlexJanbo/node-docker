const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 12) 

        const newUser = await User.create({
            username: username,
            password: hashedPassword
        })
        req.session.user = newUser
        res.status(201).json({
            status: "Success",
            data: {
                user: newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail"
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username})

        if(!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(passwordMatch) {
            req.session.user = user
            res.status(200).json({
                status: "Success",
            })
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Incorrect username or password"
            })
        }

    } catch (error) {
        res.status(400).json({
            status: "Fail"
        })
    }
}