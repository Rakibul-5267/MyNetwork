const express = require('express')

const { UserCollection, AdminCollection, PostCollection, CommentCollection } = require('./model/model')
const nid = require("nid")
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: './images/' })
const { cloudinary } = require('./cloudinary')

//****/ SignUp Work[START]
router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', async (req, res, next) => {
    req.body._id = nid(17)
    const user = await UserCollection.create(req.body)
    console.log("user", user)
    res.redirect('/login')
})

// signUp work [END]

// Login Work [END]

router.get('/login', (req, res, next) => {
    res.render('login')
})


router.post('/login', async (req, res, next) => {
    const user = await UserCollection.findOne({
        email: req.body.email, password: req.body.password
    })
    if (!user) {
        res.redirect('/login')
    } else {

        res.cookie('userIs', 'true')
        res.cookie('user', 'active')
        res.cookie('userId', user._id)
        res.redirect('/updateProfile')

    }
})

// UpdateProfile [START]
router.get('/updateProfile', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const user = await UserCollection.findOne({ _id: req.cookies.userId })
        res.render('updateProfile', { user })
    } else {
        res.render('error')
    }

})
// Upload Profile Image
router.post('/uploadProfile', upload.single('profileImage'), async (req, res, next) => {
    console.log(req.file)
    if (req.file) {
        const cloudRes = await cloudinary.uploader.upload(req.file.path)
        console.log("cloudRes", cloudRes)
        if (cloudRes.secure_url) {
            req.body.profileimgUrl = cloudRes.secure_url
        } else {
            console.log("Unable to upload profile image.")
        }
    }
    await UserCollection.updateOne({ _id: req.cookies.userId }, {
        $set: {
            profileimgUrl: req.body.profileimgUrl
        }
    })
    res.redirect('/userProfile')
})

// Upload Cover Image

router.post('/uploadCover', upload.single('coverPhoto'), async (req, res, next) => {
    if (req.file) {
        const cloudeup = await cloudinary.uploader.upload(req.file.path)
        if (cloudeup.secure_url) {
            req.body.coverimgUrl = cloudeup.secure_url
        } else {
            console.log("Unable to upload cover image.")
        }
    }
    await UserCollection.updateOne({ _id: req.cookies.userId }, {
        $set: {
            coverimgUrl: req.body.coverimgUrl
        }
    })
    res.redirect('/userProfile')
})


router.post('/updateInfo', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const userInfo = await UserCollection.updateOne({ _id: req.cookies.userId }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                dob: req.body.dob,
                city: req.body.city,
                country: req.body.country,
                about: req.body.about
            }
        })

        console.log("update", userInfo)

        res.redirect('/')
    }
})


// UpdateProfile [START]

router.get('/', async (req, res, next) => {
    if (req.cookies.userIs === 'true' && req.cookies.user === 'active') {
        const user = await UserCollection.findOne({ _id: req.cookies.userId })
        const post = await PostCollection.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'postByUser'
                }
            }
        ])

        res.render('index', { user, post })
    } else {
        res.redirect('/login')
    }
})

// Login Work [END]

// LogOut [START]
router.get('/logout', (req, res, next) => {
    res.clearCookie('userIs')
    res.clearCookie('user')
    res.redirect('/')
})
// LogOut [END]

// UaerProfile work [START]

router.get('/userProfile', async (req, res, next) => {
    if (req.cookies.userIs === 'true' && req.cookies.user === 'active') {
        const user = await UserCollection.findOne({ _id: req.cookies.userId })
        console.log("user is here", user)
        res.render('userProfile', { user })
    } else {
        res.render('error')
    }
})

// post work [START]

router.post('/submitPost', upload.single('postImage'), async (req, res, next) => {
    if (req.file) {
        const imgUp = await cloudinary.uploader.upload(req.file.path)
        if (imgUp.secure_url) {
            req.body.imageUrl = imgUp.secure_url
        } else {
            console.log("Unable to upload image")
        }
    }
    req.body._id = nid(17)
    req.body.createdBy = req.cookies.userId
    const post = await PostCollection.create(req.body)

    res.redirect('/')
})


// post work [END]

// All user [START]
router.get('/people', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const people = await UserCollection.find({ _id: { $ne: req.cookies.userId } })
        res.render('people', { people })
    }

})

router.get('/peopleProfile/:_id', async (req, res, next) => {
    const user = await UserCollection.findOne({ _id: req.params._id })
    res.render('peopleProfile', { user })
})

// All user [END]

// -----comment work on the post [START]
router.post('/addComment/:_id', async (req, res, next) => {

    const comment = await CommentCollection.create({
        _id: nid(17),
        postId: req.params._id,
        comment: req.body.comment,
        commentsId: req.cookies.userId

    })
    console.log("comment", comment)
    res.redirect("/")
})

router.get('/postDetail/:_id', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const singlePost = await PostCollection.aggregate([
            { $match: { _id: req.params._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'postByUser'
                }
            }
        ])
        const comments = await CommentCollection.aggregate([
            { $match: { postId: req.params._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'commentsId',
                    foreignField: '_id',
                    as: 'commentByUser'
                }
            }
        ])
        const num = comments.length
        const userId = req.cookies.userId
        console.log("comments", comments)
        res.render('postDetail', { singlePost, comments, num, userId })
    }

})
// -----comment work on the post [END]

// UaerProfile work [END]

// userPost work[start]
router.get('/userPost', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const userPost = await PostCollection.aggregate([
            { $match: { createdBy: req.cookies.userId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'adminPost'
                }
            }

        ])
        const user = await UserCollection.findOne({ _id: req.cookies.userId })
        console.log("userPost", userPost)
        res.render('userPost', { user, userPost })
    }
})

// userPost work[END]

// UserPost Delet work [START]
router.get('/deletPost/:_id', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const deletPost = await PostCollection.deleteOne({ _id: req.params._id })
        console.log('deletPost', deletPost)
        res.redirect('/userPost')
    }

})
// UserPost Delet work [END]

// UserPost Update work [START]
router.post('/updatePost/:_id', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const updatePost = await PostCollection.updateOne({ _id: req.params._id },
            { $set: { message: req.body.message } }
        )
res.redirect('/userPost')
    }
})
// UserPost Update work [END]

// User Commets Delet & Update Work [START]
router.get('/commentDelet/:_id', async (req, res, next)=>{
    if (req.cookies.userIs === 'true'){
       const delet =  await CommentCollection.deleteOne({_id: req.params._id})
        res.redirect('/')
    }
})

router.post('/updateComment/:_id', async (req, res, next) => {
    if (req.cookies.userIs === 'true') {
        const updatePost = await CommentCollection.updateOne({ _id: req.params._id },
            { $set: { comment: req.body.comment } }
        )
res.redirect('/')
    }
})

// User Commets Delet & Update Work [END]

router.get('/profileViews', (req, res, next) => {
    res.render('profileViews')
})

router.get('/practice', (req, res, next) => {
    res.render('practice')
})

module.exports = router