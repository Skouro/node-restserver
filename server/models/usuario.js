const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de usuario es requerido']
    },
    email: {
        unique: true,
        type: String,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: true
    },
    img: {
        required: false,
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Excluimos la contraseña para que cuando deseemos retornar un objeto d este tipo no la retorne
usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete  userObject.password;
  return userObject;

};
usuarioSchema.plugin(uniqueValidator,  {message : '{PATH} debe de ser unico'});
module.exports = mongoose.model('Usuario',usuarioSchema);
