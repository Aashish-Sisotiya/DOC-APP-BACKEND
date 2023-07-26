import UserModel from "../models/userModel.js";

export const admin = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    if (!user.isAdmin) {
      res.status(401).send({
        success: false,
        message: "only admin can access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "admin authentication failed",
    });
  }
};
