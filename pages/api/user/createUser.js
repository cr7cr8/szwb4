const { User } = require("../../../db/schema")




export default  function handler(req, res) {


    // console.log(req.body)
     return User.create({
       
         ...req.body,
        
 
     }).then(doc => {
         res.send(doc)
     })
 
 }
 
 