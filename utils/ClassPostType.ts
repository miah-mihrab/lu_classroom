export interface PostType {
    ClassPosts: [{
        author: string,
        class: string,
        comments: [],
        content: string,
        photo: string,
        time: string,
        _id: string
    }],
    classID: string,
    classname: string,
    section: string,
    student: [],
    students: Number,
    subjectname: string
}