const { User } = require("../../db/schema")



// type Data = {
//   name: string,
//   age: number,
// }

export default function handler(
  req,//: NextApiRequest,
  res,//: NextApiResponse<Data>
  // res: NextApiResponse<any>
) {

  console.log("aaaaaaaaaaaaaa",User)
  User.find({}).then(docs=>{
    console.log(docs)
  })

  res.status(200).json({ name: "john", age: 23 })
}
