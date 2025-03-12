"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../_helpers/db");
const user_model_1 = require("./user.model");
const userRepository = db_1.AppDataSource.getRepository(user_model_1.Users);
exports.userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield userRepository.find({
            select: ["firstName", "lastName", "email", "title", "role", "passwordHash"],
        });
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findOneBy({ id });
        if (!user)
            return null;
        const { title, firstName, lastName, email, role, passwordHash } = user;
        return { title, firstName, lastName, email, role, passwordHash };
    });
}
function create(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield userRepository.findOneBy({ email: params.email });
        if (existingUser) {
            throw new Error(`Email "${params.email}" is already registered`);
        }
        const user = new user_model_1.Users();
        user.firstName = params.firstName;
        user.lastName = params.lastName;
        user.email = params.email;
        user.title = params.title;
        user.role = params.role;
        user.passwordHash = params.password ? yield bcryptjs_1.default.hash(params.password, 10) : "";
        yield userRepository.save(user);
    });
}
function update(id, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findOneBy({ id });
        if (!user)
            throw new Error("User not found");
        if (params.password) {
            params.passwordHash = yield bcryptjs_1.default.hash(params.password, 10);
        }
        delete params.password;
        Object.assign(user, params);
        yield userRepository.save(user);
    });
}
function _delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findOneBy({ id });
        if (!user)
            throw new Error("User not found");
        yield userRepository.remove(user);
    });
}
