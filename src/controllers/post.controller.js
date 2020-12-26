

function postController() {
    const createPost = (req, res, next) => {
        res.json("Post was successful")
    }

    return {
        createPost
    }
}

module.exports = postController()