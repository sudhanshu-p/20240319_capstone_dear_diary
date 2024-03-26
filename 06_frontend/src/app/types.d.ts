interface blogMetadata {
    url: String,
    title: String,
    content: String,
    publish_time: Date,
    last_updated_time: Date,
    upvoted_by: Array<String>,
    downvoted_by: Array<String>,
}