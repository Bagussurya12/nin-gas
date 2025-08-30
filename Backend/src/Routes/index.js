import { Router } from "express";
import LoginController from "../Controllers/Auth/LoginController.js";
import jwtAuth from "../Middlewares/Auth/JwtAuth.js";
import checkPermission from "../Middlewares/Permissions/CheckPermission.js";
import UserController from "../Controllers/User/UserController.js";
import GuestsController from "../Controllers/Guests/GuestsController.js";

const router = Router();

router.post("/login", LoginController.login.bind(LoginController));
router.get(
  "/users/:id",
  jwtAuth(),
  checkPermission("Settings - User - Can Show User Management"),
  UserController.getUser.bind(UserController)
);
router.get(
  "/users",
  jwtAuth(),
  checkPermission("Settings - User - Can List User Management"),
  UserController.getAllUsers.bind(UserController)
);

router.post(
  "/users",
  jwtAuth(),
  checkPermission("Settings - User - Can Create User Management"),
  UserController.createUser.bind(UserController)
);

router.put(
  "/users/:id",
  jwtAuth(),
  checkPermission("Settings - User - Can Update User Management"),
  UserController.updateUser.bind(UserController)
);

router.delete(
  "/users/:id",
  jwtAuth(),
  checkPermission("Settings - User - Can Delete User Management"),
  UserController.deleteUser.bind(UserController)
);

// Guests:
router.get(
  "/guests",
  jwtAuth(),
  checkPermission("Guests - Can List Guests Management"),
  GuestsController.getAllGuest
);
router.get(
  "/guests/:id",
  jwtAuth(),
  checkPermission("Guests - Can Show Guests Management"),
  GuestsController.getGuestById
);
router.post(
  "/guests",
  jwtAuth(),
  checkPermission("Guests - Can Create Guests Management"),
  GuestsController.createGuest
);
router.put(
  "/guests/:id",
  jwtAuth(),
  checkPermission("Guests - Can Update Guests Management"),
  GuestsController.updateGuest
);

router.delete(
  "/guests/:id",
  jwtAuth(),
  checkPermission("Guests - Can Delete Guests Management"),
  GuestsController.deleteGuest
);

export default router;
