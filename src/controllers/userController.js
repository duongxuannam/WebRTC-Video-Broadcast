import { get } from 'lodash';
import axios from 'axios';
import queryString from 'querystring';
import User from '../models/user';
import logger from '../utils/logger';
import AddPoint from '../models/addPoint';
import { LEVELS, NAME_ACTIONS, ACTIONS, ROLES } from '../utils/constants';
import ServerError from '../utils/serverError';
import * as branch from '../utils/branch';
import configs from '../config';
import { AK_BASE_URL } from '../utils/constants';

// Update user profiles
export async function updateUserProfileByUser(req, res) {
  try {
    const { fullname, phone, avatar, gender, email } = req.body;
    const userID = req.user._id;
    const userUpdate = await User.findById(userID);
    userUpdate.set({
      fullname,
      phone,
      avatar,
      gender: gender ? gender : userUpdate.gender,
      email: email ? email : userUpdate.email
    });
    const objValid = {
      username: userUpdate.username,
      fullname: fullname,
      email: userUpdate.email,
      phone: phone,
      password: userUpdate.password,
      role: userUpdate.role,
      gender: userUpdate.gender
    };

    Object.keys(userUpdate).forEach(item => {
      if (userUpdate[item] === undefined) delete userUpdate[item];
    });

    await userUpdate.joiValidate(objValid);
    const user = await userUpdate.save();
    return res.status(200).json({ message: 'Success', user });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// Verify user phone
export async function verifyUserPhone(req, res) {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) throw new ServerError('User not found', 404);

    const { code } = req.body;
    if (!code) {
      throw new ServerError('Please provide account kit code', 400);
    }
    const appAccessToken = ['AA', configs.FB_APP_ID, configs.AK_APP_SECRET].join('|');
    const params = {
      grant_type: 'authorization_code',
      code: code,
      access_token: appAccessToken
    };

    const { access_token } = await axios.get(`${AK_BASE_URL}/access_token?${queryString.stringify(params)}`)
      .then(response => Promise.resolve(response.data))
      .catch(err => Promise.reject(new ServerError(get(err, ['response', 'data', 'error', 'message']), 400)));

    const response = await axios.get(`${AK_BASE_URL}/me/?access_token=` + access_token)
      .then(response => Promise.resolve(response.data))
      .catch(err => Promise.reject(new ServerError(get(err, ['response', 'data', 'error', 'message']), 400)));

    const { id, phone: { number } } = response;

    const queryOptions = { accountKitID: id };
    const existedUser = await User.findOne(queryOptions).exec();
    if (existedUser && existedUser._id !== user._id) {
      throw new ServerError('Phone is linked with other account', 400);
    }

    // Update phone number
    user.accountKitID = id;
    user.phone = number;

    user = await user.save();

    res.json({
      message: 'Success',
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        level: user.level,
        point: user.point,
        memberCode: user.memberCode,
        lastTimeAddPoint: user.lastTimeAddPoint
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// Add point user
export async function addPointUser(obj, user) {
  try {
    const now = new Date();
    const newAddPoint = new AddPoint(obj);
    let levelUser = user.level;
    const point = Math.ceil(obj.point * get(LEVELS, [levelUser, 'xPoint']));
    const pointUser = user.point + point;
    let rankOld = user.point;
    if (levelUser === LEVELS.diamond.name) {
      rankOld = get(LEVELS, [levelUser, 'scopeMin']);
    } else {
      rankOld = get(LEVELS, [levelUser, 'scopeMax']);
    }

    Object.keys(LEVELS).forEach(function (item) {
      if (pointUser >= get(LEVELS, [LEVELS.diamond.name, 'scopeMin'])) {
        levelUser = LEVELS.diamond.name;
      }
      const pointMin = get(LEVELS, [item, 'scopeMin']);
      const pointMax = get(LEVELS, [item, 'scopeMax']);
      if (pointUser >= pointMin && pointUser < pointMax) {
        if (pointUser >= rankOld) {
          levelUser = item;
        }
      }
    });

    user.set({
      point: pointUser,
      level: levelUser,
      lastTimeAddPoint: now
    });

    newAddPoint.set({
      point: point
    });
    await newAddPoint.save();
    const userUpdate = await user.save();
    return { userUpdate, point };
  } catch (err) {
    throw err;
  }
}

// User attendance
async function userAttendance(req, res) {
  try {
    const _id = req.user._id;

    const now = new Date();
    const today = new Date(now.getTime() - (now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds()));

    const queryAttendanced = {
      user: _id,
      createdAt: {
        $gte: today
      },
      action: NAME_ACTIONS.ATTENDANCE
    };
    const addPoint = await AddPoint.findOne(queryAttendanced);
    if (addPoint) throw new ServerError('Today, you have already attendance', 400);

    const objAddPoint = {
      user: _id,
      action: NAME_ACTIONS.ATTENDANCE,
      point: ACTIONS.get(NAME_ACTIONS.ATTENDANCE)
    };
    const userCurrent = await User.findById(_id);
    const { userUpdate, point } = await addPointUser(objAddPoint, userCurrent);
    res.status(200).json({ message: 'success', user: userUpdate, point: point });
  } catch (err) {
    logger.error(err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Create deeplink
export async function createInviteLink(req, res) {
  try {
    const objData = {
      user: req.user._id,
      action: NAME_ACTIONS.INVITE_FRIEND
    };
    const link = await branch.generateLink(objData);
    res.status(200).json({
      message: 'success',
      url: link
    });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// Add point user
export async function addPoint(req, res) {
  const body = req.body;
  switch (body.action) {
    case NAME_ACTIONS.ATTENDANCE:
      await userAttendance(req, res);
      break;
    case NAME_ACTIONS.INVITE_FRIEND:
      await invitedFriend(req, res);
      break;
    default:
      const err = new ServerError('Action type not exist', 400) // eslint-disable-line
      logger.error(err);
      res.status(err.code).json({ message: err.message });
  }
}

// Invited a friend
async function invitedFriend(req, res) {
  try {
    const { userInvite } = req.body.data;

    // Check click yourself
    const user = await User.findById(req.user._id);
    if (user._id == userInvite) throw new ServerError('You are the creator of the link', 400);

    // Check new user
    const now = new Date();
    const pre = new Date(now.getTime() - (5 * 60000));
    if (new Date(user.createdAt) < pre) throw new ServerError('Non-new user account', 400);

    // Check user clicked
    const queryClick = {
      user: userInvite,
      action: NAME_ACTIONS.INVITE_FRIEND,
      'metaData.invite.userInvited': user._id
    };
    let apClicked = await AddPoint.findOne(queryClick);
    if (apClicked) throw new ServerError('You have already click link', 400);

    // New addPoint user invite
    apClicked = {
      user: userInvite,
      action: NAME_ACTIONS.INVITE_FRIEND,
      point: ACTIONS.get(NAME_ACTIONS.INVITE_FRIEND),
      metaData: {
        invite: {
          userInvited: user._id
        }
      }
    };
    const userAddPoint = await User.findById(userInvite);
    await addPointUser(apClicked, userAddPoint);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// Get members rank
export async function getMembersRank(req, res) {
  try {
    let { pageSize, skip } = req.query;

    if (!pageSize) pageSize = 0;
    if (!skip) skip = 0;

    const members = await User.find({ role: ROLES.USER })
      .sort({ point: -1 })
      .limit(parseInt(pageSize)).skip(parseInt(skip));

    res.json({
      message: 'Success',
      users: members
    });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// admin change passowrd clinic
export async function changePasswordByAdmin(req, res) {
  try {
    const { newPassword } = req.body;

    const userEdit = await User.findById(req.params.id);
    if (!userEdit) throw new ServerError('Can not find user', 500);

    userEdit.set({
      password: newPassword
    });

    await userEdit.save();

    res.status(200).json({
      message: 'Success'
    });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// get users
export async function getUsers(req, res) {
  try {
    const { limit, skip, phone } = req.query;
    const sort = { createdAt: 'desc' };
    const objQuery = {};
    objQuery.role = ROLES.USER;
    if (phone) {
      objQuery.phone = { $regex: new RegExp(`${phone}`) };
    }
    const users = await User.find(objQuery)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    if (!users) throw new ServerError('Can not find any user', 500);

    const total = await User.count();

    res.status(200).json({
      message: 'Success',
      users,
      total
    });
  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// clinic get user info by itself
export async function getUser(req, res) {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) throw new ServerError('Could not find user', 404);

    res.status(200).json({
      message: 'Success',
      user
    });

  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// user change password
export async function changePassword(req, res) {
  try {
    const { _id, role } = req.user;
    const { password, oldPassword } = req.body;

    if (role === ROLES.USER) {
      throw new ServerError('You can\'t change password', 403);
    }

    const user = await User.findOne({ _id }).select('+password').exec();
    if (!user) throw new ServerError('Invalid username', 404);

    const isMatched = await user.comparePassword(oldPassword);
    if (!isMatched) {
      throw new ServerError('Your old password not matched', 401);
    }

    user.set({ password });

    await user.save();

    res.status(200).json({
      message: 'Success'
    });

  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}

// clinic update account
export async function updateAccount(req, res) {
  try {
    const { _id, role } = req.user;
    const { fullname } = req.body;

    const objUpdate = {
      fullname
    };

    if (role === ROLES.USER) {
      throw new ServerError('You can\'t change password', 403);
    }

    Object.keys(objUpdate).forEach(key => {
      if (!objUpdate[key]) delete objUpdate[key];
    });

    const user = await User.findByIdAndUpdate(_id, objUpdate);
    if (!user) throw new ServerError('Could not update user', 500);

    res.status(200).json({
      message: 'Success'
    });

  } catch (err) {
    logger.error(err);
    res.status(err.code || 500).json({ message: err.message });
  }
}