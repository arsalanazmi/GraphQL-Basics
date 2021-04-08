const Query = {
    greeting(parent, args, cntx, info) {
      if (args.name && args.position) {
        return `hello ${args.name}.You are my favourite ${args.position}.`;
      } else {
        return "Hello";
      }
    },

    add(parent, args, cntx, info) {
      if (args.number.length === 0) {
        return 0;
      } else {
        return args.number.reduce((accumalator, presentValue) => {
          return accumalator + presentValue;
        });
      }
    },

    grades(parent, args, ctx, info) {
      return [90, 91, 92];
    },

    me() {
      return {
        id: "12379",
        name: "Sarah Khan",
        email: "sarah123@gamil.com",
        age: 37,
      };
    },

    post() {
      return {
        id: "90",
        title: "GraphQL 01",
        body: "Learning Basics of GraphQl",
        published: true,
      };
    },

    users(parent, args, { db }, info) {
      console.log(args);
      console.log(db.users);
      if (!args.query) {
        return db.users;
      }
      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    posts(parent, argument, { db }, info) {
      console.log(argument);
      if (!argument.query) {
        return db.posts;
      }
      return db.posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(argument.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(argument.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },

    comments(parent, args, { db }, info) {
      return db.comments;
    },
  };

module.exports = Query