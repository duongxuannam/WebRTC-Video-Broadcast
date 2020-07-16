import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import uniqueValidator from 'mongoose-unique-validator';
import { ROLES, LEVELS, GENDERS } from 'utils/constants';
import * as regexp from 'utils/regexp';
import ServerError from 'utils/serverError';
import { makeMemberCode } from 'utils/commons';

// Define schema user
const userSchema = new Schema(
  {
    role: { type: String, default: ROLES.USER },
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    address: { type: String },
    avatar: { type: String },
    facebookID: { type: String, default: null },
    accountKitID: { type: String, default: null },
    active: { type: Boolean, default: true },
    level: { type: String, default: LEVELS.silver.name },
    point: { type: Number, default: 0 },
    lastTimeAddPoint: { type: Date, default: null },
    memberCode: { type: String },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic' },
    clinicBranch: { type: Schema.Types.ObjectId, ref: 'ClinicBranch' },
    isOnNightDuty: { type: Boolean },
    fbPagesAssigned: [{ type: String }],
    color: { type: String },
    available: { type: Boolean, default: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Hash password before save
userSchema.pre('save', function(next) {
  const user = this;
  user.phone = user.phone ? user.phone.replace(/ /g, '') : '';
  if (user.isNew || user.isModified('password')) {
    // Create member code
    if (user.isNew) {
      user.memberCode = makeMemberCode();
    }

    bcrypt.genSalt((err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) return next(err);

        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

// Valid data
userSchema.methods.joiValidate = function(obj) {
  const err = {
    username: new Error(
      'The username is between 6 and 30 characters long and do not contain special characters'
    ),
    fullname: new Error(
      'The fullname is between 6 and 30 characters long and do not contain special characters'
    ),
    email: new Error('Incorrect email format'),
    phone: new Error('Incorrect phone format'),
    password: new Error('The password is between 6 and 30 characters long'),
    role: new Error('The role not exist'),
    level: new Error('The level not exist'),
    gender: new Error('The gender not exist'),
  };
  const schema = {
    username: Joi.string()
      .min(6)
      .max(30)
      .regex(regexp.usernameRule)
      .required()
      .error(err.username),
    fullname: Joi.string()
      .min(6)
      .max(30)
      .regex(regexp.fullnameRule)
      .required()
      .error(err.fullname),
    email: Joi.string()
      .min(6)
      .regex(regexp.emailRule)
      .error(err.email),
    phone: Joi.string()
      .regex(regexp.phoneRule)
      .error(err.phone),
    password: Joi.string()
      .min(6)
      .max(30)
      .error(err.password),
    role: Joi.string()
      .valid([...Object.values(ROLES), ''])
      .error(err.role),
    level: Joi.string()
      .valid(Object.keys(LEVELS))
      .error(err.level),
    gender: Joi.string()
      .valid([...Object.values(GENDERS), ''])
      .error(err.role),
  };

  return new Promise((resolve, reject) =>
    Joi.validate(obj, schema, (err, result) => {
      if (err) return reject(new ServerError(err.message, 400));

      resolve(result);
    })
  );
};

// Compare password
userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) =>
    bcrypt.compare(password, this.password, (err, isMatched) => {
      if (err) return reject(err);
      resolve(isMatched);
    })
  );
};

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
