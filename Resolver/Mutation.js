const { v4: uuidv4 } = require("uuid");
const { post } = require("./Query");

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email Taken");
    }
    const user = {
      id: uuidv4(),
      ...args.data,
      // name: args.name,
      // email: args.email,
      // age: args.age,
    };

    db.users.push(user);

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User Not Found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExists) {
      throw new Error("Unable to find user");
    }
    if (!postExists) {
      throw new Error("Unable to find post");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not Found");
    }

    const deletedUser = db.users.splice(userIndex, 1);

    posts = db.posts.filter((post) => {
      const match = post.id === args.id;

      if (match) {
        comments = db.comments.filter((comment) => comment.id !== args.id);
      }
      return !match;
    });
    comments = db.comments.filter((comment) => comment.id !== args.id);
    return deletedUser[0];

    //   // checking whether the user is exists...
    //   const user = db.users.find((user) => user.id === args.id);
    //   if (!user) throw new Error("User Not Found!");

    //   // deleting user
    //   users = db.users.filter((u) => u.id !== user.id);

    //   // updating posts
    //   posts = db.posts.filter((post) => {
    //     const match = post.author === args.id;

    //     if (match) {
    //       comments = db.comments.filter((comment) => comment.author !== args.id);
    //     }
    //     return !match;
    //   });

    //   // updating comments
    //   comments = db.comments.filter((comment) => comment.author === args.id);

    //   return user;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post Not Found!");
    }
    const [post] = db.posts.splice(postIndex, 1);

    comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found!");
    }

    const [deleteComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deleteComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deleteComment,
      },
    });

    return deleteComment;
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User Not Found!");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email Taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }
    return user;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) throw new Error("Post Not found!");

    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        //   DELETED
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //   CREATED
        pubsub.publish("post", {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      } else if (post.published) {
        //   UPDATED
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    }
    return post;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment Not Found !");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    })
    return comment;
  },
};

module.exports = Mutation;