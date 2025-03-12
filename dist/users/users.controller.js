"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = require("../_middleware/validate-request");
const role_1 = require("../_helpers/role");
const user_service_1 = require("./user.service");
const router = express_1.default.Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);
exports.default = router;
function getAll(req, res, next) {
    user_service_1.userService.getAll()
        .then((users) => res.json(users))
        .catch(next);
}
function getById(req, res, next) {
    user_service_1.userService.getById(Number(req.params.id))
        .then((user) => res.json(user))
        .catch(next);
}
function create(req, res, next) {
    user_service_1.userService.create(req.body)
        .then(() => res.json({ message: "User created" }))
        .catch(next);
}
function update(req, res, next) {
    user_service_1.userService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: "User updated" }))
        .catch(next);
}
function _delete(req, res, next) {
    user_service_1.userService.delete(Number(req.params.id))
        .then(() => res.json({ message: "User deleted" }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    });
    (0, validate_request_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(""),
        firstName: joi_1.default.string().empty(""),
        lastName: joi_1.default.string().empty(""),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).empty(""),
        email: joi_1.default.string().email().empty(""),
        password: joi_1.default.string().min(6).empty(""),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).empty(""),
    }).with("password", "confirmPassword");
    (0, validate_request_1.validateRequest)(req, next, schema);
}
