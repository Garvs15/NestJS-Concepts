import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../entities/user.entity"

// -> unique identifier for storing and retreiving role requirements as metadata on route handlers  

export const ROLES_KEY = "roles"

// -> roles decorator markes the routes with the roles that are allowed to access them
// -> role guard will later read these metadata 

export const Roles = (...roles : UserRole[]) => SetMetadata(ROLES_KEY, roles)