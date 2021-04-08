let users = [
    {
      id: "1",
      name: "Arsalan",
      email: "arsalan.azmi92@gmail.com",
      age: 28,
    },
    {
      id: "2",
      name: "Inam Khan",
      email: "inamkhan1923@gmail.com",
      age: 27,
    },
    {
      id: "3",
      name: "Muzaffar Alam",
      email: "muzaffaralam729@gmail.com",
      age: 26,
    },
    {
      id: "4",
      name: "Fawaz Bukhari",
      email: "fawazbukhari420@gmail.com",
      age: 29,
    },
  ];
  
  let posts = [
    {
      id: "5",
      title: "Es6",
      body: "Advanced Javascript",
      published: true,
      author: "1",
    },
    {
      id: "6",
      title: "GraphQl 101",
      body: "this is how to use GarphQl",
      published: true,
      author: "1",
    },
    {
      id: "7",
      title: "Programming Music",
      body: "",
      published: true,
      author: "2",
    },
  ];
  
  let comments = [
    {
      id: "10",
      text: "Hello Dear",
      author: "1",
      post: "6",
    },
    {
      id: "11",
      text: "Nice Pic Dear",
      author: "2",
      post: "5",
    },
    {
      id: "12",
      text: "Is that u in the dp",
      author: "3",
      post: "7",
    },
  ];
  
const db = {
    users,
    posts,
    comments
} 
module.exports = db