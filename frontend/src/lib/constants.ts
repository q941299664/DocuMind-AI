// 统一错误码枚举 (需与后端 top.demotao.documind.common.ErrorCode 保持一致)
export enum ErrorCode {
    // === 通用错误 (10000-19999) ===
    SUCCESS = 200,
    SYSTEM_ERROR = 10001,
    PARAM_ERROR = 10002,

    // === 用户/认证错误 (20000-29999) ===
    USER_NOT_FOUND = 20001, // 账号不存在，是否前往注册？
    USER_EXIST = 20002,
    EMAIL_EXIST = 20003,
    VERIFY_CODE_ERROR = 20004,
    LOGIN_FAIL = 20005,
    UNAUTHORIZED = 20006,
    FORBIDDEN = 20007,

    // === 业务错误 (30000-39999) ===
    
    // === 第三方服务错误 (40000-49999) ===
    AI_SERVICE_ERROR = 40001
}
