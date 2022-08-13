const mongoose = require("mongoose")
mongoose.connect(process.env.url).then(()=>{

    console.log(`Database connected and running`);
}).catch((err)=>{



    console.log(err)
})


