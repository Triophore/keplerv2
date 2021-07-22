module.exports = {
    name:"user",
    schema:{
        username:{
            type:'string',
            unique:true,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        first_name:{
            type:String,
            required:true
        },
        last_name:{
            type:String,
            required:true
        },
        middle_name:{
            type:String,
        },
        password:{
            type:String,
            required:true
        },
        phone_muber:{
            type:String,
        },
        role:{
            type:String,
        },
        image:{
            type:String
        },
        password_reset:{
            type:String
        },
        updated_at: { type: Date, default: Date.now() },
        created_at: { type: Date, default: Date.now() },
    },
    plugins:[
        'mongoose-paginate-v2'
    ]
}
