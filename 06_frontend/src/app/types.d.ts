interface blogMetadata {
    url: string,
    title: string,
    content: string,
    publish_time: Date,
    last_updated_time: Date,
    upvoted_by: Array<string>,
    downvoted_by: Array<string>,
    comments: Array<comment>
}

interface comment {
    _id: string,
    content: string,
    author_name: string,
    parent_type: string,
    replies: Array<comment>,
    upvoted_by: Array<comment>,
    downvoted_by: Array<comment>,
}

interface User {
    _id: string,
    username: string,
    userImage: string,
    habits: Array,
    email: string,
    description: string,
    streak: {
        current: number,
        longest: number,
        total_blogs: number
    }
}

interface Hobby {
    title: string,
    frequency: Array<boolean>,
    time: string,
    _id: string,
}

interface Tab {
    title: string;
}

interface HabitInput {
    title: string,
    done: boolean,
    written_content: string
}